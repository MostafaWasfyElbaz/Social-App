"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(15, "Name must be at most 15 characters long"),
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long"),
})
    .superRefine((arg, ctx) => {
    if (arg.password !== arg.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmPassword", "password"],
            message: "Passwords do not match",
        });
    }
});
