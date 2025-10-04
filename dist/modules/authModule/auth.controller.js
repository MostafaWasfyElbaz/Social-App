"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const index_1 = require("../../middleware/index");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
const authServices = new auth_service_1.default();
router.post("/signup", (0, index_1.validationMiddleware)(auth_validation_1.signupSchema), authServices.signup);
router.post("/login", (0, index_1.validationMiddleware)(auth_validation_1.loginSchema), authServices.login);
router.post("/refresh-token", authServices.refreshToken);
router.patch("/confirm-email", (0, index_1.validationMiddleware)(auth_validation_1.confirmEmailSchema), authServices.confirmEmail);
router.patch("/resend-email-otp", (0, index_1.validationMiddleware)(auth_validation_1.resendEmailOtpSchema), authServices.resendEmailOtp);
router.patch("/forgot-password", (0, index_1.validationMiddleware)(auth_validation_1.resetPasswordSchema), authServices.forgotPassword);
exports.default = router;
