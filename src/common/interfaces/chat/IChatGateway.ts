import { IAuthSocket } from "../../";

export interface IChatGateway {
  register(socket: IAuthSocket): Promise<void>;
}
