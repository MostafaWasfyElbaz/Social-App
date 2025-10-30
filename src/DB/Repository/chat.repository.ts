import DBRepository from "./db.repository";
import { IChat, IChatRepo } from "../../common";
import { HydratedDocument, Model, Types } from "mongoose";
import { notFoundError } from "../../utils";
import UserRepository from "./user.repository";
import { Chat } from "../models/chat.model";
import { nanoid } from "nanoid";
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

  createGroup = async ({
    groupName,
    participants,
    createdBy,
  }: {
    groupName: string;
    participants: string[];
    createdBy: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>> => {
    try {
      const validUsers = await this.userRepo.find({
        filter: { _id: { $in: participants } },
      });
      if (
        !validUsers ||
        (validUsers && validUsers.length !== participants.length)
      ) {
        throw new notFoundError();
      }
      const roomId = nanoid(15);
      const [newChat] = await this.create({
        data: [
          {
            participants: [
              ...validUsers.map((user) => user._id as Types.ObjectId),
              createdBy,
            ],
            createdBy,
            groupName,
            roomId,
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

  getGroupChat = async ({
    groupId,
    createdBy,
  }: {
    groupId: Types.ObjectId;
    createdBy: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>> => {
    try {
      const chat = await this.findOne({
        filter: {
          groupName: {
            $exists: true,
          },
          _id: groupId,
          participants: {
            $in: [createdBy],
          },
        },
        options: {
          populate: {
            path: "messages.createdBy",
          },
        },
      });
      if (!chat) {
        throw new notFoundError();
      }
      return chat;
    } catch (error) {
      throw error;
    }
  };

  joinRoom = async ({
    roomId,
    createdBy,
  }: {
    roomId: Types.ObjectId;
    createdBy: Types.ObjectId;
  }): Promise<HydratedDocument<IChat>> => {
    try {
      const chat = await this.findOne({
        filter: {
          roomId,
          participants: {
            $in: [createdBy],
          },
          groupName: {
            $exists: true,
          },
        },
      });
      if (!chat) {
        throw new notFoundError();
      }
      return chat;
    } catch (error) {
      throw error;
    }
  };
}
