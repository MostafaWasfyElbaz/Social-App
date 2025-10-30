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
        .emit("newMessage", { content: data.content, from: { id: user._id } });
    } catch (error) {
      socket.emit("customError", error);
    }
  };

  joinRoom = async (socket: IAuthSocket, roomId: string): Promise<void> => {
    try {
      const user = socket.user;
      if (!user) {
        throw new notFoundError();
      }
      const group = await this.chatRepo.joinRoom({
        roomId: roomId as unknown as Types.ObjectId,
        createdBy: user._id as unknown as Types.ObjectId,
      });
      socket.join(group.roomId as string);
    } catch (error) {
      socket.emit("customError", error);
    }
  };

  sendGroupMessage = async (
    socket: IAuthSocket,
    data: { groupId: string; content: string }
  ): Promise<void> => {
    try {
      const user = socket.user;
      if (!user) {
        throw new notFoundError();
      }
      const group = await this.chatRepo.findOne({
        filter: {
          _id: data.groupId,
          groupName: {
            $exists: true,
          },
          participants: {
            $in: [user._id],
          },
        },
      });
      if (!group) {
        throw new notFoundError();
      }
      await group.updateOne({
        messages: {
          $push: {
            content: data.content,
            createdBy: user._id,
          },
        },
      });
      socket.emit("successMessage", data.content);
      socket.to(group.roomId as string).emit("newGroupMessage", {
        content: data.content,
        from: user,
        groupId: data.groupId,
      });
    } catch (error) {
      socket.emit("customError", error);
    }
  };
}
