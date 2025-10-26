"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_repository_1 = __importDefault(require("./db.repository"));
const utils_1 = require("../../utils");
const user_repository_1 = __importDefault(require("./user.repository"));
const chat_model_1 = require("../models/chat.model");
class ChatRepository extends db_repository_1.default {
    model;
    constructor(model = chat_model_1.Chat) {
        super(model);
        this.model = model;
    }
    userRepo = new user_repository_1.default();
    getChat = async ({ createdBy, receiverId, }) => {
        const user = this.userRepo.findOne({
            filter: {
                _id: receiverId,
                friends: {
                    $in: [createdBy],
                },
            },
        });
        if (!user) {
            throw new utils_1.notFoundError();
        }
        try {
            const chat = await this.findOne({
                filter: {
                    participants: {
                        $all: [createdBy, receiverId],
                    },
                    groupName: {
                        $exists: false,
                    },
                },
                options: {
                    populate: {
                        path: "participants",
                    },
                },
            });
            if (chat) {
                return chat;
            }
        }
        catch (error) {
            throw error;
        }
        try {
            const [newChat] = await this.create({
                data: [
                    {
                        participants: [createdBy, receiverId],
                        createdBy,
                    },
                ],
            });
            if (!newChat) {
                throw new utils_1.notFoundError();
            }
            return newChat;
        }
        catch (error) {
            throw error;
        }
    };
}
exports.default = ChatRepository;
