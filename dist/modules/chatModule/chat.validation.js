"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupChatSchema = exports.createGroupSchema = exports.sendMessageSchema = exports.getChatSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const utils_1 = require("../../utils");
exports.getChatSchema = zod_1.default.object({
    userId: utils_1.generalValidation.id,
});
exports.sendMessageSchema = zod_1.default.object({
    content: zod_1.default.string().min(1, "Content is required"),
    sendTo: utils_1.generalValidation.id,
});
exports.createGroupSchema = zod_1.default.object({
    groupName: zod_1.default.string().min(1, "Group name is required"),
    participants: zod_1.default.array(utils_1.generalValidation.id),
});
exports.getGroupChatSchema = zod_1.default.object({
    groupId: utils_1.generalValidation.id,
});
