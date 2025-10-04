import { NextFunction, Request, Response } from "express";

export interface IAuthServices {
  signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  confirmEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  resendEmailOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
