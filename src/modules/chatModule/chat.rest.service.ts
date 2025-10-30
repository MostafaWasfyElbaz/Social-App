import { IChatRestServices, IChat } from "../../common";
import ChatRepository from "../../DB/Repository/chat.repository";
import { HydratedDocument, Types } from "mongoose";
import { Request, Response } from "express";
import { CreateGroupDTO, GetChatDTO, GetGroupChatDTO } from "./chat.DTO";
import { IUser } from "../../common/";
import { successHandler } from "../../utils";
export default class ChatRestServices implements IChatRestServices {
  constructor() {}
  private chatRepo = new ChatRepository();

  getChat = async (req: Request, res: Response): Promise<Response> => {
    const createdBy: HydratedDocument<IUser> = res.locals.user;
    const receiverId: GetChatDTO = req.params.userId as unknown as GetChatDTO;
    const chat = await this.chatRepo.getChat({
      createdBy: createdBy._id as Types.ObjectId,
      receiverId: receiverId as unknown as Types.ObjectId,
    });
    return successHandler({
      res,
      msg: "Chat fetched successfully",
      data: chat,
      status: 200,
    });
  };

  createGroup = async (req: Request, res: Response): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { groupName, participants }: CreateGroupDTO =
      req.body as unknown as CreateGroupDTO;
    const group = await this.chatRepo.createGroup({
      groupName,
      participants,
      createdBy: user._id as Types.ObjectId,
    });
    return successHandler({
      res,
      msg: "Group created successfully",
      data: group,
      status: 200,
    });
  };

  getGroupChat = async (req: Request, res: Response): Promise<Response> => {
    const createdBy: HydratedDocument<IUser> = res.locals.user;
    const {groupId}: GetGroupChatDTO = req.params
      .groupId as unknown as GetGroupChatDTO;
    const groupChat = await this.chatRepo.getGroupChat({
      groupId: groupId as unknown as Types.ObjectId,
      createdBy: createdBy._id as Types.ObjectId,
    });
    return successHandler({
      res,
      msg: "Group chat fetched successfully",
      data: groupChat,
      status: 200,
    });
  };
}
