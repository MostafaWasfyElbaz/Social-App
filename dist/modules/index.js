"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.userRouter = void 0;
var user_controller_1 = require("./userModule/user.controller");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(user_controller_1).default; } });
var auth_controller_1 = require("./authModule/auth.controller");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
