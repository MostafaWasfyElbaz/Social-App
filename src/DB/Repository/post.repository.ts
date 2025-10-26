import DBRepository from "./db.repository";
import { IComment, IPost, IPostRepo, IUser } from "../../common";
import { Model, Types, HydratedDocument } from "mongoose";
import { invalidTagsError, notFoundError } from "../../utils";
import { likeUnlikePostDTO } from "../../modules";
import { Post } from "../models/post.model";
import UserRepository from "./user.repository";
import CommentRepository from "./comment.repository";
import { availabilityFilter } from "../models/post.model";

export default class PostRepository
  extends DBRepository<IPost>
  implements IPostRepo
{
  constructor(
    protected override readonly model: Model<IPost> = Post,
    private userRepository = new UserRepository(),
    private commentRepository = new CommentRepository()
  ) {
    super(model);
  }
  checkTags = async (tags: Types.ObjectId[]): Promise<void> => {
    const users = await this.userRepository.find({
      filter: {
        _id: { $in: tags },
        paranoid: true,
      },
      projection: { _id: 1 },
    });
    if (!users) {
      throw new notFoundError();
    }
    if (users.length !== tags.length) {
      const tags = users.map((tag) => (tag._id as Types.ObjectId).toString());
      const invalidTags = tags.filter((tag: string) => !tags.includes(tag));
      throw new invalidTagsError(invalidTags);
    }
  };

  findPost = async (
    postId: Types.ObjectId,
    user: HydratedDocument<IUser>
  ): Promise<HydratedDocument<IPost>> => {
    const post = await this.findOne({
      filter: {
        _id: postId,
        $or: availabilityFilter(user),
        paranoid: true,
      },
    }).then((post) => {
      if (!post) {
        throw new notFoundError();
      }
      post.populate("comments");
      return post;
    });
    const createdBy = await this.userRepository.findOne({
      filter: {
        paranoid: true,
        _id: post.createdBy,
      },
    });
    if (!createdBy) {
      throw new notFoundError();
    }
    if (createdBy.blockList && createdBy.blockList.includes(user._id as Types.ObjectId)) {
      throw new notFoundError();
    }
    return post;
  };

  findMyPost = async (
    postId: Types.ObjectId,
    user: HydratedDocument<IUser>,
    paranoid = false
  ): Promise<HydratedDocument<IPost>> => {
    const post = await this.findOne({
      filter: {
        _id: postId,
        createdBy: user._id,
        paranoid,
      },
    }).then((post) => {
      if (!post) {
        throw new notFoundError();
      }
      post.populate("comments");
      return post;
    });
    return post;
  };

  likeUnlikePost = async ({
    postId,
    action,
    user,
  }: likeUnlikePostDTO & { user: HydratedDocument<IUser> }): Promise<
    HydratedDocument<IPost>
  > => {
    const post = await this.findPost(postId as unknown as Types.ObjectId, user);
    if (!post) {
      throw new notFoundError();
    }
    if (action === "like") {
      await post.updateOne({
        $addToSet: {
          likes: user._id,
        },
      });
    } else if (action === "unlike") {
      await post.updateOne({
        $pull: {
          likes: user._id,
        },
      });
    } else {
      throw new notFoundError();
    }
    return post;
  };

  findMyPostAndFreezeUnfreezeDelete = async ({
    postId,
    user,
    data,
    paranoid = false,
    action,
  }: {
    postId: Types.ObjectId;
    user: HydratedDocument<IUser>;
    data?: Partial<HydratedDocument<IPost>>;
    paranoid?: boolean;
    action?: "freeze" | "active" | "delete";
  }): Promise<HydratedDocument<IPost>> => {
    const post = await this.findMyPost(
      postId as unknown as Types.ObjectId,
      user,
      paranoid
    );
    if (action === "freeze" || action === "active") {
      if (data) {
        await (post as HydratedDocument<IPost>).updateOne({
          $set: data,
        });
      }

      await this.commentRepository.updateMany({
        filter: {
          postId,
          createdBy: user._id,
        },
        data: data as unknown as Partial<HydratedDocument<IComment>>,
      });
    } else if (action === "delete") {
      await post.deleteOne();
      await this.commentRepository.deleteMany({
        filter: {
          postId,
          createdBy: user._id,
        },
      });
    } else {
      throw new notFoundError();
    }

    return post;
  };

  updatePost = async ({
    post,
    data,
  }: {
    post: HydratedDocument<IPost>;
    data: Partial<HydratedDocument<IPost>> & {
      removedAttachments: string[];
      attachmentsLink: string[];
      removedTags: string[];
      newTags: string[];
    };
  }): Promise<HydratedDocument<IPost>> => {
    if (data.newTags?.length) {
      try {
        await this.checkTags(data.newTags as unknown as Types.ObjectId[]);
      } catch (error) {
        throw error;
      }
    }
    post.updateOne({
      $set: {
        content: data.content || post.content,
        availability: data.availability || post.availability,
        allowComments: data.allowComments || post.allowComments,
        attachments: {
          $setUnion: [
            {
              $setDifference: ["$attachments", data.removedAttachments || []],
            },
            data.attachmentsLink || [],
          ],
        },
        tags: {
          $setUnion: [
            {
              $setDifference: ["$tags", data.removedTags || []],
            },
            data.newTags?.map((tag) => {
              return new Types.ObjectId(tag);
            }) || [],
          ],
        },
      },
    });
    return post;
  };
}
