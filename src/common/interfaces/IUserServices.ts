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
}
