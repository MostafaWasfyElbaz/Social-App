import { NextFunction, Request, Response } from "express";

export interface IUserServices {
  uploadCoverImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadFileWithPreSignedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  getFilesOrDownload(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteCoverImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  sendFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  unfriend(req: Request, res: Response, next: NextFunction): Promise<Response>;
  acceptFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  blockUser(req: Request, res: Response, next: NextFunction): Promise<Response>;
  rejectFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}
