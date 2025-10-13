import { Router } from "express";
import { uploadFile } from "../../utils/index";
import { auth } from "../../middleware/index";
import { createPostSchema, likeUnlikePostSchema } from "./post.validation";
import { validationMiddleware } from "../../middleware/index";
import { PostServices } from "./post.service";

const router = Router();

const postServices = new PostServices();

const routes = {
    createPost:"/",
    likeUnlikePost:"/like-unlike"
};

router.post(routes.createPost,auth(),uploadFile({}).array("attachments",5),validationMiddleware(createPostSchema),postServices.createPost) 

router.patch(routes.likeUnlikePost,auth(),validationMiddleware(likeUnlikePostSchema),postServices.likeUnlikePost);
export default router;
