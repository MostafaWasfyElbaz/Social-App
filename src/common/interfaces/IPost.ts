import { Types } from "mongoose";
import { PostAvailability } from "../";

export interface IPost {
  createdBy: Types.ObjectId;
  content?: string;
  attachments?: string[];
  tags?: Array<Types.ObjectId>;
  likes?: Array<Types.ObjectId>;
  allowComments?: boolean;
  isDeleted?: boolean;
  assetsFolderId: string;
  availability: PostAvailability;
  createdAt: Date;
  updatedAt: Date;
}
