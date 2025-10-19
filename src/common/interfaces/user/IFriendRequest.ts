import { Types } from "mongoose";

export interface IFriendRequest {
  from: Types.ObjectId;
  to: Types.ObjectId;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  email?: string | undefined;
}
