"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatGateway = void 0;
const chat_events_1 = __importDefault(require("./chat.events"));
class ChatGateway {
    chatEvents;
    constructor(chatEvents = new chat_events_1.default()) {
        this.chatEvents = chatEvents;
    }
    register = async (socket) => {
        this.chatEvents.sendMessage(socket);
        this.chatEvents.joinRoom(socket);
        this.chatEvents.sendGroupMessage(socket);
    };
}
exports.chatGateway = new ChatGateway();
