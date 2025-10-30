import { IChatEvents, IAuthSocket } from "../../common";
import ChatSocketService from "./chat.socket.service";
import { validationMiddlewareSocket } from "../../middleware";
import { sendMessageSchema } from "./chat.validation";
export default class ChatEvents implements IChatEvents {
  constructor(
    private chatSocketService: ChatSocketService = new ChatSocketService()
  ) {}
  sendMessage = async (socket: IAuthSocket): Promise<void> => {
    socket.on("sendMessage", async (data) => {
      const result = sendMessageSchema.safeParse(data);
      if (!result.success) {
        const errors: string[] = result.error.issues.map((error) => {
          return `${error.path} ==> ${error.message}`;
        });
        socket.emit("customError", errors);
        return;
      }
      this.chatSocketService.sendMessage(socket, result.data);
    });
  };

  joinRoom = async (socket: IAuthSocket): Promise<void> => {
    socket.on("join_room", async (data) => {
      try {
        this.chatSocketService.joinRoom(socket, data.roomId);
      } catch (error) {
        socket.emit("customError", error);
      }
    });
  };

  sendGroupMessage = async (socket: IAuthSocket): Promise<void> => {
    socket.on("sendGroupMessage", async (data) => {
      try {
        this.chatSocketService.sendGroupMessage(socket, {
          groupId: data.groupId,
          content: data.content,
        });
      } catch (error) {
        socket.emit("customError", error);
      }
    });
  };
}
