"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_socket_service_1 = __importDefault(require("./chat.socket.service"));
const chat_validation_1 = require("./chat.validation");
class ChatEvents {
    chatSocketService;
    constructor(chatSocketService = new chat_socket_service_1.default()) {
        this.chatSocketService = chatSocketService;
    }
    sendMessage = async (socket) => {
        socket.on("sendMessage", async (data) => {
            const result = chat_validation_1.sendMessageSchema.safeParse(data);
            if (!result.success) {
                const errors = result.error.issues.map((error) => {
                    return `${error.path} ==> ${error.message}`;
                });
                socket.emit("customError", errors);
                return;
            }
            this.chatSocketService.sendMessage(socket, result.data);
        });
    };
    joinRoom = async (socket) => {
        socket.on("join_room", async (data) => {
            try {
                this.chatSocketService.joinRoom(socket, data.roomId);
            }
            catch (error) {
                socket.emit("customError", error);
            }
        });
    };
    sendGroupMessage = async (socket) => {
        socket.on("sendGroupMessage", async (data) => {
            try {
                this.chatSocketService.sendGroupMessage(socket, {
                    groupId: data.groupId,
                    content: data.content,
                });
            }
            catch (error) {
                socket.emit("customError", error);
            }
        });
    };
}
exports.default = ChatEvents;
