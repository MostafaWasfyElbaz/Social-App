"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DBRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, projection, options, }) {
        const doc = this.model.findOne(filter, projection, options);
        if (options?.lean) {
            doc.lean();
        }
        return doc;
    }
    create = async ({ data, options, }) => {
        return this.model.create(data, options);
    };
    async findById({ id, projection, options, }) {
        const doc = this.model.findById(id, projection, options);
        if (options?.lean) {
            doc.lean();
        }
        return doc;
    }
}
exports.default = DBRepository;
