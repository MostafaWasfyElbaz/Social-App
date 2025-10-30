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
    createGroup = async (req, res) => {
        const user = res.locals.user;
        const { groupName, participants } = req.body;
        const group = await this.chatRepo.createGroup({
            groupName,
            participants,
            createdBy: user._id,
        });
        return (0, utils_1.successHandler)({
            res,
            msg: "Group created successfully",
            data: group,
            status: 200,
        });
    };
    getGroupChat = async (req, res) => {
        const createdBy = res.locals.user;
        const { groupId } = req.params
            .groupId;
        const groupChat = await this.chatRepo.getGroupChat({
            groupId: groupId,
            createdBy: createdBy._id,
        });
        return (0, utils_1.successHandler)({
            res,
            msg: "Group chat fetched successfully",
            data: groupChat,
            status: 200,
        });
    };
}
exports.default = ChatRestServices;
