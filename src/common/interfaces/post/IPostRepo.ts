import { HydratedDocument, Types } from "mongoose";
import { IPost, IUser } from "../..";
import { likeUnlikePostDTO } from "../../../modules";

export interface IPostRepo {
  checkTags(tags: Types.ObjectId[]): Promise<void>;
  findPost(
    postId: Types.ObjectId,
    user: HydratedDocument<IUser>
  ): Promise<HydratedDocument<IPost>>;
  findMyPost(
    postId: Types.ObjectId,
    user: HydratedDocument<IUser>
  ): Promise<HydratedDocument<IPost>>;
  likeUnlikePost({
    postId,
    action,
    user,
  }: likeUnlikePostDTO & { user: HydratedDocument<IUser> }): Promise<
    HydratedDocument<IPost>
  >;
  findMyPostAndFreezeUnfreezeDelete({
    postId,
    user,
    data,
    action,
  }: {
    postId: Types.ObjectId;
    user: HydratedDocument<IUser>;
    data?: Partial<HydratedDocument<IPost>>;
    action?: "freeze" | "active" | "delete";
  }): Promise<HydratedDocument<IPost>>;
  updatePost({
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
  }): Promise<HydratedDocument<IPost>>;
}
