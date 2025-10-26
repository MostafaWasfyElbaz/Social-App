import DBRepository from "./db.repository";
import { IChat, IChatRepo } from "../../common";
import { HydratedDocument, Model, Types } from "mongoose";
import { notFoundError } from "../../utils";
import UserRepository from "./user.repository";
import { Chat } from "../models/chat.model";
export default class ChatRepository
  extends DBRepository<IChat>
  implements IChatRepo
{
  constructor(protected override readonly model: Model<IChat> = Chat) {
    super(model);
  }
  private userRepo = new UserRepository();

  getChat = async ({
    createdBy,
    receiverId,
  }: {
    createdBy: Types.ObjectId;
    receiverId: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>> => {
    const user = this.userRepo.findOne({
      filter: {
        _id: receiverId,
        friends: {
          $in: [createdBy],
        },
      },
    });
    if (!user) {
      throw new notFoundError();
    }

    try {
      const chat = await this.findOne({
        filter: {
          participants: {
            $all: [createdBy, receiverId],
          },
          groupName: {
            $exists: false,
          },
        },
        options: {
          populate: {
            path: "participants",
          },
        },
      });
      if (chat) {
        return chat;
      }
    } catch (error) {
      throw error;
    }
    try {
      const [newChat] = await this.create({
        data: [
          {
            participants: [createdBy, receiverId],
            createdBy,
          },
        ],
      });
      if (!newChat) {
        throw new notFoundError();
      }

      return newChat as HydratedDocument<IChat>;
    } catch (error) {
      throw error;
    }
  };
}
