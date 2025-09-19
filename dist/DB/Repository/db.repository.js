"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepository = void 0;
class DBRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ data, projection, option }) {
        return this.model.findOne(data, projection, option);
    }
    async createOne({ data, option }) {
        return this.model.create([data], option);
    }
}
exports.DBRepository = DBRepository;
