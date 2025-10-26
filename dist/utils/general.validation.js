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
    name: zod_1.default
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(15, "Name must be at most 15 characters long"),
    email: zod_1.default.email("Invalid email"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters long"),
    _2FA: zod_1.default.boolean().optional().default(false),
    otp: zod_1.default.string().min(6, "OTP must be at least 6 characters long"),
    id: zod_1.default.string().length(24),
};
