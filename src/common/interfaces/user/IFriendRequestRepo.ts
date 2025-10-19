import { IFriendRequest } from "./IFriendRequest";
import { IUser } from "./IUser";
import { HydratedDocument } from "mongoose";
    

export interface IFriendRepo {
  createFriendRequest({
    user,
    friend,
  }: {
    user: HydratedDocument<IUser>;
    friend: HydratedDocument<IUser>;
  }): Promise<HydratedDocument<IFriendRequest>>;
  acceptFriendRequest({
    friendRequest,
  }: {
    friendRequest: HydratedDocument<IFriendRequest>;
  }): Promise<HydratedDocument<IFriendRequest>>;
  deleteOrRejectFriendRequest({
    friendRequest,
  }: {
    friendRequest: HydratedDocument<IFriendRequest>;
  }): Promise<HydratedDocument<IFriendRequest>>;
  blockUser({
    user,
    friend,
  }: {
    user: HydratedDocument<IUser>;
    friend: HydratedDocument<IUser>;
  }): Promise<void>;

}
