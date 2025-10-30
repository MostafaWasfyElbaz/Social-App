"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_repository_1 = __importDefault(require("./db.repository"));
const utils_1 = require("../../utils");
const user_repository_1 = __importDefault(require("./user.repository"));
const chat_model_1 = require("../models/chat.model");
const nanoid_1 = require("nanoid");
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
    createGroup = async ({ groupName, participants, createdBy, }) => {
        try {
            const validUsers = await this.userRepo.find({
                filter: { _id: { $in: participants } },
            });
            if (!validUsers ||
                (validUsers && validUsers.length !== participants.length)) {
                throw new utils_1.notFoundError();
            }
            const roomId = (0, nanoid_1.nanoid)(15);
            const [newChat] = await this.create({
                data: [
                    {
                        participants: [
                            ...validUsers.map((user) => user._id),
                            createdBy,
                        ],
                        createdBy,
                        groupName,
                        roomId,
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
    getGroupChat = async ({ groupId, createdBy, }) => {
        try {
            const chat = await this.findOne({
                filter: {
                    groupName: {
                        $exists: true,
                    },
                    _id: groupId,
                    participants: {
                        $in: [createdBy],
                    },
                },
                options: {
                    populate: {
                        path: "messages.createdBy",
                    },
                },
            });
            if (!chat) {
                throw new utils_1.notFoundError();
            }
            return chat;
        }
        catch (error) {
            throw error;
        }
    };
    joinRoom = async ({ roomId, createdBy, }) => {
        try {
            const chat = await this.findOne({
                filter: {
                    roomId,
                    participants: {
                        $in: [createdBy],
                    },
                    groupName: {
                        $exists: true,
                    },
                },
            });
            if (!chat) {
                throw new utils_1.notFoundError();
            }
            return chat;
        }
        catch (error) {
            throw error;
        }
    };
}
exports.default = ChatRepository;
