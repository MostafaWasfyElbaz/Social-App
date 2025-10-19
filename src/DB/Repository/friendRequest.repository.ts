import DBRepository from "./db.repository";
import { IFriendRequest, IUser, IFriendRepo } from "../../common";
import { FriendRequestModel } from "../models/friendRequest.model";
import { HydratedDocument } from "mongoose";
import { unableToSetFriendRequest } from "../../utils";
import UserRepository from "./user.repository";

export default class FriendRequestRepository
  extends DBRepository<IFriendRequest>
  implements IFriendRepo
{
  constructor(private userRepository = new UserRepository()) {
    super(FriendRequestModel);
  }
  createFriendRequest = async ({
    user,
    friend,
  }: {
    user: HydratedDocument<IUser>;
    friend: HydratedDocument<IUser>;
  }): Promise<HydratedDocument<IFriendRequest>> => {
    const request = await this.findOne({
      filter: {
        $or: [
          { from: user._id, to: friend._id },
          { from: friend._id, to: user._id },
        ],
      },
    });
    if (request) {
      throw new unableToSetFriendRequest();
    }
    return await this.model.create({
      from: user._id,
      to: friend._id,
      email: friend.email,
    });
  };
  
  acceptFriendRequest = async ({
    friendRequest,
  }: {
    friendRequest: HydratedDocument<IFriendRequest>;
  }): Promise<HydratedDocument<IFriendRequest>> => {
    await this.updateOne({
      filter: { _id: friendRequest._id },
      data: { acceptedAt: new Date() },
    });
    await this.userRepository.updateOne({
      filter: { _id: friendRequest.to },
      data: { $addToSet: { friends: friendRequest.from } },
    });
    await this.userRepository.updateOne({
      filter: { _id: friendRequest.from },
      data: { $addToSet: { friends: friendRequest.to } },
    });
    return friendRequest;
  };

  deleteOrRejectFriendRequest = async ({
    friendRequest,
  }: {
    friendRequest: HydratedDocument<IFriendRequest>;
  }): Promise<HydratedDocument<IFriendRequest>> => {
    await this.deleteOne({
      filter: { _id: friendRequest._id },
    });
    return friendRequest;
  };

  blockUser = async ({
    user,
    friend,
  }: {
    user: HydratedDocument<IUser>;
    friend: HydratedDocument<IUser>;
  }): Promise<void> => {
    try {
      await this.userRepository.updateOne({
        filter: { _id: user._id },
        data: {
          blockList: { $addToSet: friend._id },
        },
      });
      await this.userRepository.updateOne({
        filter: { _id: friend._id },
        data: {
          blockList: { $addToSet: user._id },
        },
      });
      await this.deleteOne({
        filter: {
          $or: [
            { from: user._id, to: friend._id },
            { from: friend._id, to: user._id },
          ],
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
