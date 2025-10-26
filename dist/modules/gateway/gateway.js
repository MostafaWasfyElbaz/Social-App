"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialization = exports.connectedUsers = void 0;
const socket_io_1 = require("socket.io");
const middleware_1 = require("../../middleware");
const chat_gateway_1 = require("../chatModule/chat.gateway");
exports.connectedUsers = new Map();
const disconnect = async (socket) => {
    socket.on("disconnect", () => {
        const currentUser = exports.connectedUsers.get((socket.user?._id).toString()) || [];
        const disconnectedUser = currentUser.filter((id) => id !== socket.id);
        exports.connectedUsers.set((socket.user?._id).toString(), disconnectedUser);
        console.log(exports.connectedUsers);
    });
};
const connect = async (socket) => {
    const currentUser = exports.connectedUsers.get((socket.user?._id).toString()) || [];
    currentUser.push(socket.id);
    exports.connectedUsers.set((socket.user?._id).toString(), currentUser);
    console.log(exports.connectedUsers);
};
const initialization = async (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
    io.use(async (socket, next) => {
        try {
            const { user } = await (0, middleware_1.decodeToken)({
                authorization: socket.handshake.auth.authorization,
            });
            socket.user = user;
            next();
        }
        catch (error) {
            throw error;
        }
    });
    io.on("connection", async (socket) => {
        chat_gateway_1.chatGateway.register(socket);
        await connect(socket);
        await disconnect(socket);
    });
};
exports.initialization = initialization;
