import { Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  createdBy: Types.ObjectId;
  content: String;
  tags: Array<Types.ObjectId> | undefined;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean | undefined;
  deletedAt?: Date | undefined;
  deletedBy?: Types.ObjectId | undefined;
}
