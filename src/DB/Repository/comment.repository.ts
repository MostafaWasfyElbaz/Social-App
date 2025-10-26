import { Model, Types, HydratedDocument } from "mongoose";
import { IComment, ICommentRepo, IUser } from "../../common";
import DBRepository from "./db.repository";
import { notFoundError } from "../../utils";
import { Comment } from "../models/comment.model";

export default class CommentRepository
  extends DBRepository<IComment>
  implements ICommentRepo
{
  constructor(protected override readonly model: Model<IComment> = Comment) {
    super(model);
  }
  private async getPostRepo() {
    const { default: PostRepository } = await import("./post.repository.js");
    return new PostRepository();
  }

  createComment = async ({
    content,
    postId,
    tags,
    user,
  }: {
    content: string;
    postId: Types.ObjectId;
    tags?: Types.ObjectId[];
    user: HydratedDocument<IUser>;
  }): Promise<Partial<HydratedDocument<IComment>>[]> => {
    const postRepo = await this.getPostRepo();
    const post = await postRepo.findPost(postId, user);

    if (!post) {
      throw new notFoundError();
    }
    if (!post.allowComments) {
      throw new notFoundError();
    }
    if (tags) {
      await postRepo.checkTags(tags);
    }

    return await this.create({
      data: [
        {
          content,
          postId,
          tags,
          createdBy: user._id as Types.ObjectId,
        },
      ],
    });
  };

  findComment = async (
    commentId: string,
    user: HydratedDocument<IUser>,
    type: "my" | "all" = "my"
  ): Promise<HydratedDocument<IComment>> => {
    const postRepo = await this.getPostRepo();
    const comment = await this.findOne({
      filter: {
        _id: commentId,
        ...(type === "my" ? { createdBy: user._id, paranoid: false } : {paranoid: true}),
      },
    });
    if (!comment) {
      throw new notFoundError();
    }
    const post = type === "all" ? await postRepo.findPost(comment.postId, user) : await postRepo.findMyPost(comment.postId, user);
    if (!post) {
      throw new notFoundError();
    }

    return comment;
  };

  findCommentAndFreezeUnfreezeDelete = async ({
    commentId,
    user,
    data,
    action,
  }: {
    commentId: string;
    user: HydratedDocument<IUser>;
    data: Partial<HydratedDocument<IComment>>;
    action?: "freeze" | "active" | "delete";
  }): Promise<Partial<HydratedDocument<IComment>>> => {
    const comment = await this.findComment(commentId, user);
    if (action === "freeze" || action === "active") {
      await comment.updateOne({
        $set: data,
      });
    } else if (action === "delete") {
      await comment.deleteOne();
    } else {
      throw new notFoundError();
    }
    return comment;
  };

  updateComment = async ({
    commentId,
    user,
    data,
  }: {
    commentId: string;
    user: HydratedDocument<IUser>;
    data?: Partial<HydratedDocument<IComment>> & {
      removedTags?: string[] | undefined;
      newTags?: string[] | undefined;
    };
  }): Promise<HydratedDocument<IComment>> => {
    const postRepo = await this.getPostRepo();

    const comment = await this.findComment(commentId, user);
    if (data?.tags?.length) {
      await postRepo.checkTags(data.tags as unknown as Types.ObjectId[]);
    }
    await comment.updateOne({
      $set: {
        content: data?.content || comment.content,
        tags: {
          $setUnion: [
            {
              $setDifference: ["$tags", data?.removedTags || []],
            },
            data?.newTags?.map((tag) => new Types.ObjectId(tag)) || [],
          ],
        },
      },
    });
    return comment;
  };
}
