import { Request, Response, NextFunction } from "express";
import { IPost, IPostServices, IUser } from "../../common";
import { HydratedDocument, Types } from "mongoose";
import PostRepository from "../../DB/Repository/post.repository";
import CommentRepository from "../../DB/Repository/comment.repository";
import {
  faildToCreatePost,
  failedToUpload,
  invalidTagsError,
  notFoundError,
  S3Services,
  successHandler,
} from "../../utils";
import { nanoid } from "nanoid";
import { likeUnlikePostDTO, updatePostDTO } from "./post.DTO";

export class PostServices implements IPostServices {
  constructor(
    private postRepository = new PostRepository(),
    private commentRepository = new CommentRepository(),
    private s3Services = new S3Services()
  ) {}

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const assetsFolderId = nanoid(15);
    const path = `${res.locals.user._id}/posts/${assetsFolderId}`;
    let uploadedFiles: string[] = [];

    if (req.body.tags?.length) {
      if (req.body.tags.includes(res.locals.user._id.toString())) {
        throw new invalidTagsError([
          `${res.locals.user._id.toString()} yourself`,
        ]);
      }
      try {
        await this.postRepository.checkTags(req.body.tags);
      } catch (error) {
        throw error;
      }
    }
    if (files?.length > 0) {
      try {
        uploadedFiles = await this.s3Services.uploadMultiFiles({
          files,
          Path: path,
        });
      } catch (error) {
        throw error;
      }
      if (uploadedFiles?.length != files.length) {
        throw new failedToUpload();
      }
    }
    try {
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
    } catch (error) {
      throw error;
    }
  };

  likeUnlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postId, action }: likeUnlikePostDTO & { postId: Types.ObjectId } =
      req.body;
    const user: HydratedDocument<IUser> = res.locals.user;
    try {
      const post = await this.postRepository.likeUnlikePost({
        postId,
        action,
        user,
      });
      return successHandler({
        res,
        data: post,
        msg:
          action === "like"
            ? "Post liked successfully"
            : "Post unliked successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postId } = req.params;
    try {
      const post = await this.postRepository.findPost(
        postId as unknown as Types.ObjectId,
        res.locals.user
      );
      return successHandler({
        res,
        data: post,
        msg: "Post fetched successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  freezePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postId } = req.params;
    const user: HydratedDocument<IUser> = res.locals.user;
    try {
      await this.postRepository.findMyPostAndFreezeUnfreezeDelete({
        postId: postId as unknown as Types.ObjectId,
        user,
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: user._id as Types.ObjectId },
        action: "freeze",
      });
      return successHandler({
        res,
        msg: "Post frozen successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  activatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postId } = req.params;
    const user: HydratedDocument<IUser> = res.locals.user;
    try {
      await this.postRepository.findMyPostAndFreezeUnfreezeDelete({
        postId: postId as unknown as Types.ObjectId,
        user,
        data: {
          isDeleted: false,
          deletedAt: undefined,
          deletedBy: undefined,
        },
        paranoid: false,
        action: "active",
      });
      return successHandler({
        res,
        msg: "Post activated successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postId } = req.params;
    const user: HydratedDocument<IUser> = res.locals.user;
    let post: HydratedDocument<IPost>;
    try {
      post = await this.postRepository.findMyPostAndFreezeUnfreezeDelete({
        postId: postId as unknown as Types.ObjectId,
        user,
        action: "delete",
      });
    } catch (error) {
      throw error;
    }
    if (post.attachments?.length) {
      try {
        this.s3Services.deleteAssets({ urls: post.attachments });
      } catch (error) {
        throw error;
      }
    }
    return successHandler({
      res,
      data: post,
      msg: "Post deleted successfully",
      status: 200,
    });
  };

  updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const {
      content,
      availability,
      allowComments,
      removedAttachments = [],
      removedTags = [],
      newTags = [],
    }: updatePostDTO = req.body;
    const postId = req.params.postId as unknown as Types.ObjectId;
    const newAttachments = (req.files as Express.Multer.File[]) || [];
    let attachmentsLink: string[] = [];
    let post: HydratedDocument<IPost>;
    let updatedPost: HydratedDocument<IPost>;

    try {
      post = await this.postRepository.findMyPost(postId, user);
    } catch (error) {
      throw error;
    }

    if (!post) {
      throw new notFoundError();
    }

    if (newAttachments?.length) {
      try {
        attachmentsLink = await this.s3Services.uploadMultiFiles({
          files: newAttachments,
          Path: `${user._id}/posts/${post.assetsFolderId}`,
        });
      } catch (error) {
        throw error;
      }
    }

    if (attachmentsLink?.length !== newAttachments?.length) {
      throw new failedToUpload();
    }
    
    try {
      updatedPost = await this.postRepository.updatePost({
        post,
        data: {
          ...(content !== undefined && { content }),
          ...(availability !== undefined && { availability }),
          ...(allowComments !== undefined && { allowComments }),
          removedAttachments,
          removedTags,
          newTags,
          attachmentsLink,
        },
      });
    } catch (error) {
      throw error;
    }

    if (removedAttachments?.length) {
      try {
        this.s3Services.deleteAssets({ urls: removedAttachments });
      } catch (error) {
        throw error;
      }
    }

    return successHandler({
      res,
      data: updatedPost,
      msg: "Post updated successfully",
      status: 200,
    });
  };
}
