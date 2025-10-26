import { HydratedDocument,Types } from "mongoose";
import { IChat } from "../..";

export interface IChatRepo {
  getChat({
    createdBy,
    receiverId,
  }: {
    createdBy: Types.ObjectId;
    receiverId: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>>;
}
