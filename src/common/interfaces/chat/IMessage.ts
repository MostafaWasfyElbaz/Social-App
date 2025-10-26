import { Types } from "mongoose";

export interface IMessage {
  createdBy: Types.ObjectId;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}
