import { IAuthSocket, IChatSocketServices } from "../../common";
import { notFoundError } from "../../utils";
import ChatRepository from "../../DB/Repository/chat.repository";
import { Types } from "mongoose";
import { connectedUsers } from "../gateway/gateway";
export default class ChatSocketService implements IChatSocketServices {
  constructor(private chatRepo = new ChatRepository()) {}

  sendMessage = async (socket: IAuthSocket, data: any): Promise<void> => {
    const user = socket.user;
    const receiverId = data.sendTo;
    if (!user || !receiverId) {
      throw new notFoundError();
    }
    try {
      const chat = await this.chatRepo.getChat({
        createdBy: user._id as unknown as Types.ObjectId,
        receiverId: receiverId,
      });

      const updatedChat = await this.chatRepo.updateOne({
        filter: {
          _id: chat._id,
        },
        data: {
          $push: {
            messages: {
              content: data.content,
              createdBy: user._id,
            },
          },
        },
      });
      socket.emit("successMessage", data.content);
      socket
        .to(connectedUsers.get(receiverId.toString()) || [])
        .emit("newMessage", { content: data.content, from: {id:user._id} });
    } catch (error) {
      socket.emit("customError", error);
    }
  };
}
