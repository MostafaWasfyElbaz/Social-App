import { ICommentServices, IUser } from "../../common";
import { NextFunction, Request, Response } from "express";
import {
  failedToCreateComment,
  successHandler,
  notFoundError,
} from "../../utils";
import { HydratedDocument } from "mongoose";
import { updateCommentDTO } from "./comment.DTO";
import CommentRepository from "../../DB/Repository/comment.repository";

export class CommentService implements ICommentServices {
  constructor(private commentRepo = new CommentRepository()) {}

  createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { content, postId, tags } = req.body;
    const user = res.locals.user;
    try {
      const comment = await this.commentRepo.createComment({
        content,
        postId,
        tags,
        user,
      });
      if (!comment) {
        throw new failedToCreateComment();
      }
      return successHandler({
        res,
        data: comment,
        msg: "Comment created successfully",
        status: 201,
      });
    } catch (error) {
      throw error;
    }
  };

  getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { commentId } = req.params;
    const user = res.locals.user;
    const comment = await this.commentRepo.findComment(
      commentId as string,
      user,
      "all"
    );
    if (!comment) {
      throw new notFoundError();
    }
    return successHandler({
      res,
      data: comment,
      msg: "Comment fetched successfully",
      status: 200,
    });
  };

  freezeComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { commentId } = req.params as { commentId: string };
    try {
      const comment = await this.commentRepo.findCommentAndFreezeUnfreezeDelete(
        {
          commentId,
          user,
          data: { isDeleted: true, deletedAt: new Date(), deletedBy: user._id },
          action: "freeze",
        }
      );
      return successHandler({
        res,
        data: comment,
        msg: "Comment frozen successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  activateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { commentId } = req.params as { commentId: string };
    try {
      const comment = await this.commentRepo.findCommentAndFreezeUnfreezeDelete(
        {
          commentId,
          user,
          data: {
            isDeleted: undefined,
            deletedAt: undefined,
            deletedBy: undefined,
          },
          action: "active",
        }
      );
      return successHandler({
        res,
        data: comment,
        msg: "Comment activated successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { commentId } = req.params as { commentId: string };
    try {
      const comment = await this.commentRepo.findCommentAndFreezeUnfreezeDelete(
        {
          commentId,
          user,
          action: "delete",
          data:{}
        }
      );
      return successHandler({
        res,
        data: comment,
        msg: "Comment deleted successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { commentId } = req.params as { commentId: string };
    const { content, newTags, removedTags }: updateCommentDTO = req.body;

    try {
      const comment = await this.commentRepo.updateComment({
        commentId,
        user,
        data: { content, newTags, removedTags },
      });
      return successHandler({
        res,
        data: comment,
        msg: "Comment updated successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };
}
