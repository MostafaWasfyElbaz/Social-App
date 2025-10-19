import { HydratedDocument, Types } from "mongoose";
import { IUser, IComment } from "../../";

export interface ICommentRepo {
  createComment(data: {
    content: string;
    postId: Types.ObjectId;
    tags?: Types.ObjectId[];
    user: HydratedDocument<IUser>;
  }): Promise<Partial<HydratedDocument<IComment>>[]>;
  findComment(
    commentId: string,
    user: HydratedDocument<IUser>,
    type : "my" | "all" 
  ): Promise<HydratedDocument<IComment>>;
  findCommentAndFreezeUnfreezeDelete({
    commentId,
    user,
    data,
    action,
  }: {
    commentId: string;
    user: HydratedDocument<IUser>;
    data: Partial<HydratedDocument<IComment>>;
    action?: "freeze" | "active" | "delete";
  }): Promise<Partial<HydratedDocument<IComment>>>;
  updateComment({
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
  }): Promise<HydratedDocument<IComment>>;
}
