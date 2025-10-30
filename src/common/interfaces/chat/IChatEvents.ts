import { IAuthSocket } from "../../";

export interface IChatEvents {
    sendMessage(socket: IAuthSocket): Promise<void>;
    joinRoom(socket: IAuthSocket): Promise<void>;
}
