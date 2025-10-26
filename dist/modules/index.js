"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = exports.commentRouter = exports.postRouter = exports.authRouter = exports.userRouter = void 0;
var user_controller_1 = require("./userModule/user.controller");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(user_controller_1).default; } });
var auth_controller_1 = require("./authModule/auth.controller");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var post_controller_1 = require("./postModule/post.controller");
Object.defineProperty(exports, "postRouter", { enumerable: true, get: function () { return __importDefault(post_controller_1).default; } });
var comment_controller_1 = require("./commentModule/comment.controller");
Object.defineProperty(exports, "commentRouter", { enumerable: true, get: function () { return __importDefault(comment_controller_1).default; } });
var chat_controller_1 = require("./chatModule/chat.controller");
Object.defineProperty(exports, "chatRouter", { enumerable: true, get: function () { return __importDefault(chat_controller_1).default; } });
