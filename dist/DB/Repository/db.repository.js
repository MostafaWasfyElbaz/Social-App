"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DBRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    findOne = async ({ filter, projection, options, }) => {
        const doc = this.model.findOne(filter, projection, options);
        if (options?.lean) {
            doc.lean();
        }
        return doc;
    };
    create = async ({ data, options, }) => {
        return this.model.create(data, options);
    };
    findById = async ({ id, projection, options, }) => {
        const doc = this.model.findById(id, projection, options);
        if (options?.lean) {
            doc.lean();
        }
        return doc;
    };
    find = async ({ filter, projection, options, }) => {
        const doc = this.model.find(filter, projection, options);
        if (options?.lean) {
            doc.lean();
        }
        return doc;
    };
}
exports.default = DBRepository;
