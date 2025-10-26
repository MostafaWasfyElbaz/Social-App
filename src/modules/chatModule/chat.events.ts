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
}
