"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const chat_repository_1 = __importDefault(require("../../DB/Repository/chat.repository"));
const gateway_1 = require("../gateway/gateway");
class ChatSocketService {
    chatRepo;
    constructor(chatRepo = new chat_repository_1.default()) {
        this.chatRepo = chatRepo;
    }
    sendMessage = async (socket, data) => {
        const user = socket.user;
        const receiverId = data.sendTo;
        if (!user || !receiverId) {
            throw new utils_1.notFoundError();
        }
        try {
            const chat = await this.chatRepo.getChat({
                createdBy: user._id,
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
                .to(gateway_1.connectedUsers.get(receiverId.toString()) || [])
                .emit("newMessage", { content: data.content, from: { id: user._id } });
        }
        catch (error) {
            socket.emit("customError", error);
        }
    };
    joinRoom = async (socket, roomId) => {
        try {
            const user = socket.user;
            if (!user) {
                throw new utils_1.notFoundError();
            }
            const group = await this.chatRepo.joinRoom({
                roomId: roomId,
                createdBy: user._id,
            });
            socket.join(group.roomId);
        }
        catch (error) {
            socket.emit("customError", error);
        }
    };
    sendGroupMessage = async (socket, data) => {
        try {
            const user = socket.user;
            if (!user) {
                throw new utils_1.notFoundError();
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
                throw new utils_1.notFoundError();
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
            socket.to(group.roomId).emit("newGroupMessage", {
                content: data.content,
                from: user,
                groupId: data.groupId,
            });
        }
        catch (error) {
            socket.emit("customError", error);
        }
    };
}
exports.default = ChatSocketService;
