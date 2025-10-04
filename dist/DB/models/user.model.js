"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const index_1 = require("../../common/index");
const utils_1 = require("../../utils");
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
    changedCredentialsAt: Date,
    profileImage: String,
    coverImages: [
        {
            type: String,
        },
    ],
});
usersSchema.pre("save", async function (next) {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
        this.password = await (0, utils_1.createHash)(this.password);
    }
    if (this.isModified("passwordOtp")) {
        if (this.passwordOtp) {
            this.passwordOtp.otp = await (0, utils_1.createHash)(this.passwordOtp.otp);
        }
    }
});
usersSchema.post("save", async function (doc, next) {
    const that = this;
    if (that.wasNew) {
        const otp = (0, utils_1.generateOTP)();
        utils_1.emailEmitter.publish(index_1.Events.confirmEmail, {
            to: that.email,
            subject: "Confirm Email",
            html: (0, utils_1.template)(otp, `${that.firstName} ${that.lastName}`, "Confirm Email"),
        });
        that.emailOtp = {
            otp: await (0, utils_1.createHash)(otp),
            expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRATION)),
        };
        await that.save();
    }
    console.log(this.isModified("password"));
});
exports.User = (0, mongoose_1.model)("User", usersSchema);
exports.default = exports.User;
