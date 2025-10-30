import { HydratedDocument, Types } from "mongoose";
import { IChat } from "../..";

export interface IChatRepo {
  getChat({
    createdBy,
    receiverId,
  }: {
    createdBy: Types.ObjectId;
    receiverId: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>>;
  createGroup({
    groupName,
    participants,
  }: {
    groupName: string;
    participants: string[];
    createdBy: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>>;
  joinRoom({
    roomId,
    createdBy,
  }: {
    roomId: Types.ObjectId;
    createdBy: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>>;
  
}
