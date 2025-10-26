
import { Request, Response } from "express";

export interface IChatRestServices {
  getChat(req: Request, res: Response): Promise<Response>;
}
