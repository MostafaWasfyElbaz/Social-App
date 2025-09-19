"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
const authServices = new auth_service_1.default();
router.post("/signup", (0, validation_middleware_1.validationMiddleware)(auth_validation_1.signupSchema), authServices.signup);
exports.default = router;
