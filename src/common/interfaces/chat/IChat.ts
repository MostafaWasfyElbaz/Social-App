import { Types } from "mongoose";
import { IMessage } from "./IMessage";

export interface IChat {
  participants: Types.ObjectId[];
  messages: IMessage[];
  groupName?: string;
  groupImage?: string;
  roomId?: string;
  createdBy: Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}
