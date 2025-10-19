import { Request, Response, NextFunction } from "express";
import { IUserServices, IUser } from "../../common";
import {
  notFoundError,
  S3Services,
  successHandler,
  unableToSetFriendRequest,
  unauthorizedError,
} from "../../utils";
import { HydratedDocument, Types } from "mongoose";
import FriendRequestRepository from "../../DB/Repository/friendRequest.repository";
import UserRepository from "../../DB/Repository/user.repository";
import {
  acceptFriendRequestDTO,
  blockUserDTO,
  deleteFriendRequestDTO,
  rejectFriendRequestDTO,
  sendFriendRequestDTO,
  unfriendDTO,
} from "./user.DTO";

class UserServices implements IUserServices {
  constructor(
    private s3Services = new S3Services(),
    private friendRequestRepository = new FriendRequestRepository(),
    private userRepository = new UserRepository()
  ) {}
  uploadProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
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
      throw error;
    }
  };

  uploadFileWithPreSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const user = res.locals.user as HydratedDocument<IUser>;
      const { ContentType, Originalname } = req.body;
      const { url, Key } = await this.s3Services.preSignedUrl({
        ContentType,
        Originalname,
        Path: `${user._id}/presigned-profilePicture`,
      });
      return successHandler({
        res,
        msg: "PreSigned URL generated successfully",
        data: { url, Key },
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  uploadCoverImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
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
      throw error;
    }
  };

  getFilesOrDownload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { path } = req.params as unknown as { path: string[] };
      const { downloadName } = req.query as { downloadName?: string };
      const Key = path.join("/");
      const file = await this.s3Services.getAsset({ Key });
      const stream = file.Body as ReadableStream;
      if (!file?.Body) {
        throw new notFoundError();
      }
      res.set("Content-Type", file.ContentType);
      if (downloadName) {
        res.set(
          "Content-Disposition",
          `attachment; filename=${downloadName}.${Key.split(".").pop()}`
        );
      }
      return successHandler({
        res,
        msg: "File downloaded successfully",
        data: { stream },
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  getFilesOrDownloadPreSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { path } = req.params as unknown as { path: string[] };
      const { downloadName, download } = req.query as {
        downloadName?: string;
        download?: string;
      };
      const Key = path.join("/");
      const url = await this.s3Services.getAssetPreSignedUrl({
        Key: Key as string,
        downloadName: downloadName as string,
        download: download as string,
      });
      return successHandler({
        res,
        msg: "link generated successfully",
        data: { url },
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { path } = req.params as unknown as { path: string[] };
      const Key = path.join("/");
      if (res.locals.user.profileImage !== Key) {
        throw new unauthorizedError();
      }
      const file = await this.s3Services.deleteAsset({ Key });
      return successHandler({
        res,
        msg: "profile image deleted successfully",
        data: { file },
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteCoverImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { urls } = req.body as unknown as { urls: string[] };
      if (urls.length === 0) {
        throw new notFoundError();
      }
      for (const url of urls) {
        if (!res.locals.user.coverImages.includes(url)) {
          throw new unauthorizedError();
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
      throw error;
    }
  };

  updateUserBasicInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const user = res.locals.user as HydratedDocument<IUser>;
      const { firstName, lastName } = req.body;
      const updatedUser = await this.userRepository.updateOne({
        filter: { _id: user._id },
        data: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
        },
      });
      return successHandler({
        res,
        msg: "User info updated successfully",
        data: { updatedUser },
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  sendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const user = res.locals.user as HydratedDocument<IUser>;
      const { to }: sendFriendRequestDTO = req.params as sendFriendRequestDTO;
      if(user.blockList.includes(Types.ObjectId.createFromHexString(to))){
        throw new notFoundError();
      }
      if (user._id.toString() === to) {
        throw new unableToSetFriendRequest();
      }
      let friend;
      try {
        friend = await this.userRepository.findById({ id: to });
        if (!friend) {
          throw new notFoundError();
        }
      } catch (err) {
        throw err;
      }
      try {
        await this.friendRequestRepository.createFriendRequest({
          user,
          friend,
        });
      } catch (err) {
        throw err;
      }
      return successHandler({
        res,
        msg: "Friend request sent successfully",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };

  acceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { from }: acceptFriendRequestDTO =
      req.params as acceptFriendRequestDTO;
    let friendRequest;
    try {
      friendRequest = await this.friendRequestRepository.findOne({
        filter: { from, to: user._id, acceptedAt: { $exists: false } },
      });
    } catch (error) {
      throw error;
    }
    if (!friendRequest || friendRequest?.acceptedAt) {
      throw new notFoundError();
    }
    try {
      await this.friendRequestRepository.acceptFriendRequest({
        friendRequest,
      });
    } catch (error) {
      throw error;
    }
    return successHandler({
      res,
      msg: "Friend request accepted successfully",
      status: 200,
    });
  };

  deleteFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { to }: deleteFriendRequestDTO = req.params as deleteFriendRequestDTO;
    let friendRequest;
    try {
      friendRequest = await this.friendRequestRepository.findOne({
        filter: { from: user._id, to, acceptedAt: { $exists: false } },
      });
      if (!friendRequest || friendRequest?.acceptedAt) {
        throw new notFoundError();
      }
    } catch (error) {
      throw error;
    }
    try {
      await this.friendRequestRepository.deleteOne({
        filter: { _id: friendRequest._id },
      });
    } catch (error) {
      throw error;
    }
    return successHandler({
      res,
      msg: "Friend request deleted successfully",
      status: 200,
    });
  };

  unfriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { friendId }: unfriendDTO = req.params as unfriendDTO;
    let friendRequest;
    try {
      friendRequest = await this.friendRequestRepository.findOne({
        filter: {
          $or: [
            { from: user._id, to: friendId, acceptedAt: { $exists: true } },
            { from: friendId, to: user._id, acceptedAt: { $exists: true } },
          ],
        },
      });
      if (!friendRequest || !friendRequest?.acceptedAt) {
        throw new notFoundError();
      }
    } catch (error) {
      throw error;
    }
    try {
      await this.friendRequestRepository.deleteOne({
        filter: { _id: friendRequest._id },
      });
    } catch (error) {
      throw error;
    }
    return successHandler({
      res,
      msg: "Unfriend successfully",
      status: 200,
    });
  };

  rejectFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { from }: rejectFriendRequestDTO =
      req.params as rejectFriendRequestDTO;
    let friendRequest;
    try {
      friendRequest = await this.friendRequestRepository.findOne({
        filter: { from, to: user._id, acceptedAt: { $exists: false } },
      });
    } catch (error) {
      throw error;
    }
    if (!friendRequest || friendRequest?.acceptedAt) {
      throw new notFoundError();
    }
    try {
      await this.friendRequestRepository.deleteOne({
        filter: { _id: friendRequest._id },
      });
    } catch (error) {
      throw error;
    }
    return successHandler({
      res,
      msg: "Friend request rejected successfully",
      status: 200,
    });
  };

  blockUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { to }: blockUserDTO = req.params as blockUserDTO;
    if(user.blockList.includes(Types.ObjectId.createFromHexString(to))){
        throw new notFoundError();
    }
    if (user._id.toString() === to) {
      throw new notFoundError();
    }
    let target;
    try {
      target = await this.userRepository.findById({ id: to });
      if (!target) {
        throw new notFoundError();
      }
    } catch (error) {
      throw error;
    }

    try {
      await this.friendRequestRepository.blockUser({
        user,
        friend: target,
      });
    } catch (error) {
      throw error;
    }

    return successHandler({
      res,
      msg: "User blocked successfully",
      status: 200,
    });
  };
}

export default UserServices;
