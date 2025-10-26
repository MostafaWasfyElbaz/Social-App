import { IAuthSocket } from "../../";

export interface IChatEvents {
    sendMessage(socket: IAuthSocket): Promise<void>;
}
