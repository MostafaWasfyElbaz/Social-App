import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import { Types } from "mongoose";
import { decodeToken } from "../../middleware";
import { IAuthSocket } from "../../common";
import { chatGateway } from "../chatModule/chat.gateway";

export const connectedUsers = new Map<string, string[]>();
const disconnect = async (socket: IAuthSocket) => {
  socket.on("disconnect", () => {
    const currentUser =
      connectedUsers.get((socket.user?._id as Types.ObjectId).toString()) || [];
    const disconnectedUser = currentUser.filter((id) => id !== socket.id);
    connectedUsers.set(
      (socket.user?._id as Types.ObjectId).toString(),
      disconnectedUser
    );
    console.log(connectedUsers);
  });
};
const connect = async (socket: IAuthSocket) => {
  const currentUser =
    connectedUsers.get((socket.user?._id as Types.ObjectId).toString()) || [];
  currentUser.push(socket.id);
  connectedUsers.set(
    (socket.user?._id as Types.ObjectId).toString(),
    currentUser
  );
  console.log(connectedUsers);
};

export const initialization = async (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket: IAuthSocket, next) => {
    try {
      const { user } = await decodeToken({
        authorization: socket.handshake.auth.authorization,
      });
      socket.user = user;
      next();
    } catch (error) {
      throw error;
    }
  });

  io.on("connection", async (socket: IAuthSocket) => {
    chatGateway.register(socket);
    await connect(socket);
    await disconnect(socket);
  });
};
