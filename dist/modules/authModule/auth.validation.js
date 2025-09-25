"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.resendEmailOtpSchema = exports.confirmEmailSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../../common");
exports.signupSchema = zod_1.z
    .object({
    firstName: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(15, "Name must be at most 15 characters long"),
    lastName: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(15, "Name must be at most 15 characters long"),
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    phone: zod_1.z
        .string()
        .min(11, "Phone number must be at least 11 characters long")
        .regex(/^01[0-9]{9}$/, "Phone number must be at least 11 characters long"),
    gender: zod_1.z.enum(common_1.Gender).optional(),
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
exports.confirmEmailSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    otp: zod_1.z.string().min(6, "OTP must be at least 6 characters long"),
});
exports.resendEmailOtpSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    otp: zod_1.z.string().min(6, "OTP must be at least 6 characters long"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
