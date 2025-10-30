import { IAuthSocket } from "../../";

export interface IChatSocketServices {
  sendMessage(socket: IAuthSocket, data: any): Promise<void>;
  joinRoom(socket: IAuthSocket, roomId: string): Promise<void>;
  sendGroupMessage(socket: IAuthSocket, data: {groupId:string,content:string}): Promise<void>;
}
