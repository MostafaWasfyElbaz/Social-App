import { Request, Response, NextFunction } from "express";
import { IPostServices, IUser, PostAvailability } from "../../common";
import { HydratedDocument } from "mongoose";
import { availabilityFilter, PostRepository } from "../../DB";
import {
  faildToCreatePost,
  failedToUpload,
  invalidTagsError,
  notFoundError,
  S3Services,
  successHandler,
} from "../../utils";
import { nanoid } from "nanoid";
import { likeUnlikePostDTO } from "./post.DTO";

export class PostServices implements IPostServices {
  constructor(
    private postRepository = new PostRepository(),
    private s3Services = new S3Services()
  ) {}

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    if (req.body.tags?.length) {
      if (req.body.tags.includes(res.locals.user._id.toString())) {
        throw new invalidTagsError([
          `${res.locals.user._id.toString()} yourself`,
        ]);
      }
      const tagsCount = await this.postRepository.checkTags(req.body.tags);
      if (tagsCount.length !== req.body.tags.length) {
        const tags = tagsCount.map((tag) => tag._id.toString());
        const invalidTags = req.body.tags.filter(
          (tag: string) => !tags.includes(tag)
        );
        throw new invalidTagsError(invalidTags);
      }
    }

    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const assetsFolderId = nanoid(15);
    const path = `${res.locals.user._id}/posts/${assetsFolderId}`;
    let uploadedFiles: string[] = [];
    if (files?.length > 0) {
      uploadedFiles = await this.s3Services.uploadMultiFiles({
        files,
        Path: path,
      });
      if (uploadedFiles?.length != files.length) {
        throw new failedToUpload();
      }
    }
    const post = await this.postRepository.create({
      data: {
        ...req.body,
        attachments: uploadedFiles,
        assetsFolderId,
        createdBy: res.locals.user._id,
      },
    });
    if (!post) {
      throw new faildToCreatePost();
    }
    return successHandler({
      res,
      msg: "Post created successfully",
      status: 201,
    });
  };

  likeUnlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postId, action }: likeUnlikePostDTO = req.body;
    const user: HydratedDocument<IUser> = res.locals.user;
    const post = await this.postRepository.findOne({
      filter: {
        _id: postId,
        $or: availabilityFilter(user),
      },
    });
    if (!post) {
      throw new notFoundError();
    }
    if (action === "like") {
      await post.updateOne({
        $addToSet: {
          likes: user._id,
        },
      });
    }
    if (action === "unlike") {
      await post.updateOne({
        $pull: {
          likes: user._id,
        },
      });
    }
    return successHandler({
      res,
      data: post,
      msg:
        action === "like"
          ? "Post liked successfully"
          : "Post unliked successfully",
      status: 200,
    });
  };
}
