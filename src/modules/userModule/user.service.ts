import { Request, Response, NextFunction } from "express";
import { IUserServices, IUser } from "../../common/index";
import { UserRepository } from "../../DB/index";
import { notFoundError, S3Services, successHandler, unauthorizedError } from "../../utils/index";
import { HydratedDocument } from "mongoose";
import {pipeline} from "stream";
import { promisify } from "util";
const pipelinePromise = promisify(pipeline);

class UserServices implements IUserServices {
  constructor(
    private userRepo = new UserRepository(),
    private s3Services = new S3Services()
  ) {}
  uploadProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = res.locals.user as HydratedDocument<IUser>;
      const { file } = req;
      const Key = await this.s3Services.uploadSingleFile({
        file: file as Express.Multer.File,
        Path: `${user._id}/profilePicture`,
      });
      user.profileImage = Key;
      await user.save();
      return successHandler({
        res,
        msg: "Profile picture uploaded successfully",
        data: { Key },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadFileWithPreSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = res.locals.user as HydratedDocument<IUser>;
      const { ContentType,Originalname } = req.body;
      const {url,Key} = await this.s3Services.preSignedUrl({
        ContentType,
        Originalname,
        Path: `${user._id}/presigned-profilePicture`,
      });
      return successHandler({
        res,
        msg: "PreSigned URL generated successfully",
        data: { url,Key },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadCoverImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = res.locals.user as HydratedDocument<IUser>;
      const { files } = req;
      const keys = await this.s3Services.uploadMultiFiles({
        files: files as Express.Multer.File[],
        Path: `${user._id}/coverImages`,
      });
      user.coverImages = keys;
      await user.save();
      return successHandler({
        res,
        msg: "Cover images uploaded successfully",
        data: { keys },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  getFilesOrDownload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { path } = req.params as unknown as {path:string[]};
      const {downloadName} = req.query as {downloadName?:string};
      const Key = path.join("/")
      const file = await this.s3Services.getAsset({ Key });
      const stream = file.Body as ReadableStream;
      if(!file?.Body){
        throw new notFoundError()
      }
      res.set("Content-Type", file.ContentType);
      if(downloadName){
        res.set("Content-Disposition", `attachment; filename=${downloadName}.${Key.split('.').pop()}`);
      }
      return await pipelinePromise(stream,res);
    } catch (error) {
      next(error);
    }
  };

  getFilesOrDownloadPreSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { path } = req.params as unknown as {path:string[]};
      const {downloadName,download} = req.query as {downloadName?:string,download?:string};
      const Key = path.join("/")
      const url = await this.s3Services.getAssetPreSignedUrl({ Key:Key as string,downloadName:downloadName as string,download:download as string });
      return successHandler({
        res,
        msg: "link generated successfully",
        data: { url },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };
  
  deleteProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { path } = req.params as unknown as {path:string[]};
      const Key = path.join("/")
      if(res.locals.user.profileImage !== Key){
        throw new unauthorizedError()
      }
      const file = await this.s3Services.deleteAsset({ Key });
      return successHandler({
        res,
        msg: "profile image deleted successfully",
        data: { file },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCoverImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { urls } = req.body as unknown as {urls:string[]};
      if(urls.length === 0){
        throw new notFoundError()
      }
      for(const url of urls){
        if(!res.locals.user.coverImages.includes(url)){
          throw new unauthorizedError()
        }
      }
      const file = await this.s3Services.deleteAssets({ urls });
      return successHandler({
        res,
        msg: "cover images deleted successfully",
        data: { file },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserServices;
