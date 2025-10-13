"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../utils/index");
const index_2 = require("../../middleware/index");
const post_validation_1 = require("./post.validation");
const index_3 = require("../../middleware/index");
const post_service_1 = require("./post.service");
const router = (0, express_1.Router)();
const postServices = new post_service_1.PostServices();
const routes = {
    createPost: "/",
    likeUnlikePost: "/like-unlike"
};
router.post(routes.createPost, (0, index_2.auth)(), (0, index_1.uploadFile)({}).array("attachments", 5), (0, index_3.validationMiddleware)(post_validation_1.createPostSchema), postServices.createPost);
router.patch(routes.likeUnlikePost, (0, index_2.auth)(), (0, index_3.validationMiddleware)(post_validation_1.likeUnlikePostSchema), postServices.likeUnlikePost);
exports.default = router;
