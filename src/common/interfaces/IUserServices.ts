import { NextFunction, Request, Response } from "express";

export interface IUserServices {
  uploadCoverImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  uploadProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  uploadFileWithPreSignedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getFilesOrDownload(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  deleteProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  deleteCoverImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
