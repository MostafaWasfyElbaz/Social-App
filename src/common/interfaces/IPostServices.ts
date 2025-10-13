import { NextFunction, Request, Response } from "express";

export interface IPostServices {
    createPost(req:Request,res:Response,next:NextFunction):Promise<Response>
    likeUnlikePost(req:Request,res:Response,next:NextFunction):Promise<Response>
}
