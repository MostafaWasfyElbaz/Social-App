"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.getChatSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const utils_1 = require("../../utils");
exports.getChatSchema = zod_1.default.object({
    userId: utils_1.generalValidation.id,
});
exports.sendMessageSchema = zod_1.default.object({
    content: zod_1.default.string().min(1, "Content is required"),
    sendTo: utils_1.generalValidation.id,
});
