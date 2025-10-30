
import { Request, Response } from "express";

export interface IChatRestServices {
  getChat(req: Request, res: Response): Promise<Response>;
  createGroup(req: Request, res: Response): Promise<Response>;
  getGroupChat(req: Request, res: Response): Promise<Response>;
}
