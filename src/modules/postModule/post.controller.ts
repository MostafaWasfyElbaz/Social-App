import { Router } from "express";
import { uploadFile } from "../../utils/index";
import { auth } from "../../middleware/index";
import {
  createPostSchema,
  likeUnlikePostSchema,
  checkPostIdSchema,
  updatePostSchema,
} from "./post.validation";
import { validationMiddleware } from "../../middleware/index";
import { PostServices } from "./post.service";

const router = Router();

const postServices = new PostServices();

const routes = {
  createPost: "/",
  likeUnlikePost: "/like-unlike",
  getPostById: "/get-post-by-id/:postId",
  freezePost: "/freeze-post/:postId",
  activatePost: "/activate-post/:postId",
  deletePost: "/delete-post/:postId",
  updatePost: "/update-post/:postId",
};

router.get(
  routes.getPostById,
  auth(),
  validationMiddleware(checkPostIdSchema),
  postServices.getPostById
);

router.post(
  routes.createPost,
  auth(),
  uploadFile({}).array("attachments", 5),
  validationMiddleware(createPostSchema),
  postServices.createPost
);

router.patch(
  routes.likeUnlikePost,
  auth(),
  validationMiddleware(likeUnlikePostSchema),
  postServices.likeUnlikePost
);
router.patch(
  routes.freezePost,
  auth(),
  validationMiddleware(checkPostIdSchema),
  postServices.freezePost
);
router.patch(
  routes.activatePost,
  auth(),
  validationMiddleware(checkPostIdSchema),
  postServices.activatePost
);

router.patch(
  routes.updatePost,
  auth(),
  uploadFile({}).array("attachments", 5),
  validationMiddleware(updatePostSchema),
  postServices.updatePost
);

router.delete(
  routes.deletePost,
  auth(),
  validationMiddleware(checkPostIdSchema),
  postServices.deletePost
);

export default router;
