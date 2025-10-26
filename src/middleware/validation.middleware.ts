import { NextFunction, Request, Response } from "express";
import { validationError } from "../utils/Error";
import { z } from "zod";
import { IAuthSocket } from "../common";
export const validationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...req.query,
      ...req.params,
      ...req.file,
      files: req.files,
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors: string[] = result.error.issues.map((error) => {
        return `${error.path} ==> ${error.message}`;
      });
      throw new validationError(errors, 400);
    }
    next();
  };
};
export const validationMiddlewareSocket = (schema: z.ZodSchema) => {
  return (socket: IAuthSocket, next: NextFunction) => {
    const data = {
      ...socket,
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors: string[] = result.error.issues.map((error) => {
        return `${error.path} ==> ${error.message}`;
      });
      throw new validationError(errors, 400);
    }
    next();
  };
};
