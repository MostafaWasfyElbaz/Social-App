import { IAuthSocket } from "../../";

export interface IChatSocketServices {
  sendMessage(socket: IAuthSocket, data: any): Promise<void>;
}
