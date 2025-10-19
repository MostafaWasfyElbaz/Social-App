"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../common");
const index_1 = require("./index");
exports.generalValidation = {
    to: zod_1.default.string().length(24),
    from: zod_1.default.string().length(24),
    content: zod_1.default.string().optional(),
    files: ({ Types = index_1.MimeType.images, fieldName = "attachments", }) => {
        return zod_1.default
            .array(zod_1.default.object({
            fieldname: zod_1.default.enum([fieldName]),
            originalname: zod_1.default.string(),
            encoding: zod_1.default.string(),
            mimetype: zod_1.default.enum(Types),
            buffer: zod_1.default.any().optional(),
            path: zod_1.default.string().optional(),
            size: zod_1.default.number(),
        }))
            .optional();
    },
    tags: zod_1.default.array(zod_1.default.string()).optional(),
    allowComments: zod_1.default.boolean().optional().default(true),
    availability: zod_1.default
        .enum([
        common_1.PostAvailability.FRIENDS,
        common_1.PostAvailability.PRIVATE,
        common_1.PostAvailability.PUBLIC,
    ])
        .optional()
        .default(common_1.PostAvailability.PUBLIC),
};
