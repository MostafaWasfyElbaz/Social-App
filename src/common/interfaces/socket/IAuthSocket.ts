import { HydratedDocument } from "mongoose";
import { IUser } from "../..";
import { Socket } from "socket.io";

export interface IAuthSocket extends Socket {
  user?: HydratedDocument<IUser>;
}
