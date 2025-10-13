"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = exports.UserRepository = void 0;
__exportStar(require("./models/user.model"), exports);
__exportStar(require("./models/post.model"), exports);
var user_repository_1 = require("./Repository/user.repository");
Object.defineProperty(exports, "UserRepository", { enumerable: true, get: function () { return __importDefault(user_repository_1).default; } });
var post_repository_1 = require("./Repository/post.repository");
Object.defineProperty(exports, "PostRepository", { enumerable: true, get: function () { return __importDefault(post_repository_1).default; } });
