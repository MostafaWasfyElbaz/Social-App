import { NextFunction, Request, Response } from "express";

export interface ICommentServices {
    createComment(req:Request,res:Response,next:NextFunction):Promise<Response>
    freezeComment(req:Request,res:Response,next:NextFunction):Promise<Response>
    activateComment(req:Request,res:Response,next:NextFunction):Promise<Response>
    deleteComment(req:Request,res:Response,next:NextFunction):Promise<Response>
    getCommentById(req:Request,res:Response,next:NextFunction):Promise<Response>
    updateComment(req:Request,res:Response,next:NextFunction):Promise<Response>
}
