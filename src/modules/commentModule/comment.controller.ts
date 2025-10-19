import { Router } from "express";
import { CommentService } from "./comment.service";
import { auth } from "../../middleware";
import { validationMiddleware } from "../../middleware/index";
import { createCommentSchema, checkPostIdSchema, updateCommentSchema } from "./comment.validation";

const router = Router();
const commentsService = new CommentService();

const routes = {
  createComment: "/",
  getCommentById: "/get-comment/:commentId",
  deleteComment: "/delete-comment/:commentId",
  freezeComment: "/freeze-comment/:commentId",
  activateComment: "/activate-comment/:commentId",
  updateComment: "/update-comment/:commentId",
};
router.get(
  routes.getCommentById,
  auth(),
  validationMiddleware(checkPostIdSchema),
  commentsService.getCommentById
);

router.post(
  routes.createComment,
  auth(),
  validationMiddleware(createCommentSchema),
  commentsService.createComment
);

router.patch(
  routes.freezeComment,
  auth(),
  validationMiddleware(checkPostIdSchema),
  commentsService.freezeComment
);
router.patch(
  routes.activateComment,
  auth(),
  validationMiddleware(checkPostIdSchema),
  commentsService.activateComment
);

router.patch(
  routes.updateComment,
  auth(),
  validationMiddleware(updateCommentSchema),
  commentsService.updateComment
);

router.delete(
  routes.deleteComment,
  auth(),
  validationMiddleware(checkPostIdSchema),
  commentsService.deleteComment
);

export default router;
