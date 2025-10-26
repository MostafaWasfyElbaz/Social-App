
import { IAuthSocket, IChatGateway } from "../../common";
import ChatEvents from "./chat.events";

class ChatGateway implements IChatGateway {
    constructor(private chatEvents: ChatEvents = new ChatEvents()) {}
    register = async (socket: IAuthSocket): Promise<void> => {
        this.chatEvents.sendMessage(socket);
    }
}

export const chatGateway = new ChatGateway();