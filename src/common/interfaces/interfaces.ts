import { Document } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Gender, otpType } from "../index";
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  gender?: Gender;
  password: string;
  emailOtp: otpType;
  passwordOtp: otpType;
  phone: string;
  isConfirmed: boolean;
  changedCredentialsAt: Date;
}

export interface IError extends Error {
  statusCode: number;
}

export interface IAuthServices {
  signup(req: Request, res: Response, next: NextFunction): Promise<Response|void>;
  confirmEmail(req: Request, res: Response, next: NextFunction): Promise<Response|void>;
  resendEmailOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response|void>;
  login(req: Request, res: Response, next: NextFunction): Promise<Response|void>;
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response|void>;
  forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response|void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response|void>;
}

export interface IPayload {
  id: string;
  jti: string;
  iat: number;
  exp: number;
}
