"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usersSchema = new mongoose_1.Schema({
    firstName: { type: String, required: [true, "Name is required"] },
    lastName: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    emailOtp: {
        otp: { type: String },
        expiresAt: { type: Date },
    },
    phone: { type: String },
});
const User = (0, mongoose_1.model)("User", usersSchema);
exports.default = User;
