"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const index_1 = require("../../common/index");
const usersSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Name is required"],
    },
    gender: {
        type: String,
        enum: index_1.Gender,
        default: index_1.Gender.male,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    emailOtp: {
        otp: { type: String },
        expiresAt: { type: Date },
    },
    passwordOtp: {
        otp: { type: String },
        expiresAt: { type: Date },
    },
    phone: {
        type: String,
        unique: [true, "Phone number already exists"],
        required: [true, "Phone number is required"],
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    changedCredentialsAt: Date
});
exports.User = (0, mongoose_1.model)("User", usersSchema);
exports.default = exports.User;
