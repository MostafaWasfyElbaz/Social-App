"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_repository_1 = __importDefault(require("../../DB/Repository/chat.repository"));
const utils_1 = require("../../utils");
class ChatRestServices {
    constructor() { }
    chatRepo = new chat_repository_1.default();
    getChat = async (req, res) => {
        const createdBy = res.locals.user;
        const receiverId = req.params.userId;
        const chat = await this.chatRepo.getChat({
            createdBy: createdBy._id,
            receiverId: receiverId,
        });
        return (0, utils_1.successHandler)({
            res,
            msg: "Chat fetched successfully",
            data: chat,
            status: 200,
        });
    };
}
exports.default = ChatRestServices;
