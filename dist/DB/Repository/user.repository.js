"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_repository_1 = __importDefault(require("../Repository/db.repository"));
const index_1 = require("../index");
const index_2 = require("../../utils/index");
class UserRepository extends db_repository_1.default {
    model;
    constructor(model = index_1.User) {
        super(model);
        this.model = model;
    }
    async findUserByEmail(email) {
        return this.model.findOne({ email });
    }
    async createUser(user) {
        const isExist = await this.findUserByEmail(user.email);
        if (isExist) {
            throw new index_2.userExistError();
        }
        return this.model.create(user);
    }
}
exports.default = UserRepository;
