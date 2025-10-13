"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_repository_1 = __importDefault(require("./db.repository"));
const __1 = require("../");
class PostRepository extends db_repository_1.default {
    model;
    constructor(model = __1.Post) {
        super(model);
        this.model = model;
    }
    userRepository = new __1.UserRepository();
    checkTags = async (tags) => {
        const users = await this.userRepository.find({
            filter: {
                _id: { $in: tags },
            }, projection: { _id: 1 }
        });
        if (!users) {
            return [];
        }
        return users;
    };
}
exports.default = PostRepository;
