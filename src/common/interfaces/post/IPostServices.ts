import { NextFunction, Request, Response } from "express";

export interface IPostServices {
    createPost(req:Request,res:Response,next:NextFunction):Promise<Response>
    likeUnlikePost(req:Request,res:Response,next:NextFunction):Promise<Response>
    getPostById(req:Request,res:Response,next:NextFunction):Promise<Response>
    freezePost(req:Request,res:Response,next:NextFunction):Promise<Response>
    activatePost(req:Request,res:Response,next:NextFunction):Promise<Response>
    deletePost(req:Request,res:Response,next:NextFunction):Promise<Response>
    updatePost(req:Request,res:Response,next:NextFunction):Promise<Response>
}
