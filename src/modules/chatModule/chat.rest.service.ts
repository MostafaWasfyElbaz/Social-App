import { IChatRestServices, IChat } from "../../common";
import ChatRepository from "../../DB/Repository/chat.repository";
import { HydratedDocument, Types } from "mongoose";
import { Request, Response } from "express";
import { GetChatDTO } from "./chat.DTO";
import { IUser } from "../../common/";
import { successHandler } from "../../utils";
export default class ChatRestServices implements IChatRestServices {
  constructor() {}
  private chatRepo = new ChatRepository();

  getChat = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
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
}
