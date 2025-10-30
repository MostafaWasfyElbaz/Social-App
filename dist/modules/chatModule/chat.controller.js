"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_rest_service_1 = __importDefault(require("./chat.rest.service"));
const middleware_1 = require("../../middleware");
const middleware_2 = require("../../middleware");
const chat_validation_1 = require("./chat.validation");
const router = (0, express_1.Router)();
const chatRestServices = new chat_rest_service_1.default();
const routes = {
    getChat: "/",
    createGroup: "/create-group",
    getGroupChat: "/group/:groupId",
};
router.get(routes.getGroupChat, (0, middleware_1.auth)(), (0, middleware_2.validationMiddleware)(chat_validation_1.getGroupChatSchema), chatRestServices.getGroupChat);
router.get(routes.getChat, (0, middleware_1.auth)(), (0, middleware_2.validationMiddleware)(chat_validation_1.getChatSchema), chatRestServices.getChat);
router.post(routes.createGroup, (0, middleware_1.auth)(), (0, middleware_2.validationMiddleware)(chat_validation_1.createGroupSchema), chatRestServices.createGroup);
exports.default = router;
