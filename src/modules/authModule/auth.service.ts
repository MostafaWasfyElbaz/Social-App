import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../DB/index";
import { IAuthServices, Events, Gender, TokenType } from "../../common/index";
import {
  generateOTP,
  emailEmitter,
  template,
  failedToCreateUser,
  notFoundError,
  userAlreadyConfirmedError,
  otpExpiredError,
  compareHash,
  invalidCredentialsError,
  otpNotExpiredError,
  userNotConfirmedError,
  successHandler,
  generateToken,
  generateAccessToken,
} from "../../utils/index";
import {
  signupDTO,
  resendEmailOtpDTO,
  loginDTO,
  resetPasswordDTO,
  forgotPasswordDTO,
} from "./auth.DTO";
import { nanoid } from "nanoid";
import { decodeToken } from "../../middleware/index";

class AuthServices implements IAuthServices {
  constructor(private userRepo = new UserRepository()) {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { firstName, lastName, email, password, gender, phone }: signupDTO =
        req.body;
      const user = await this.userRepo.createUser({
        firstName,
        lastName,
        email,
        password,
        gender: gender || Gender.male,
        phone,
      });
      if (!user) {
        throw new failedToCreateUser();
      }
      return successHandler({
        res,
        msg: "User created successfully",
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, otp } = req.body;
      const user = await this.userRepo.findUserByEmail(email);
      if (!user) {
        throw new notFoundError();
      }
      if (user?.isConfirmed || !user.emailOtp) {
        throw new userAlreadyConfirmedError();
      }
      if (user.emailOtp.expiresAt <= new Date()) {
        throw new otpExpiredError();
      }
      const isMatch = await compareHash(otp, user.emailOtp.otp);
      if (!isMatch) {
        throw new invalidCredentialsError();
      }
      user.isConfirmed = true;
      user.emailOtp = null;
      await user.save();
      successHandler({ res, msg: "Email confirmed successfully", status: 200 });
    } catch (error) {
      next(error);
    }
  };
  resendEmailOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email }: resendEmailOtpDTO = req.body;
      const user = await this.userRepo.findUserByEmail(email);
      if (!user) {
        throw new notFoundError();
      }
      if (user?.isConfirmed || !user.emailOtp) {
        throw new userAlreadyConfirmedError();
      }
      if (user.emailOtp.expiresAt >= new Date()) {
        throw new otpNotExpiredError();
      }
      const confirmEmailOtp = generateOTP();
      const subject: string = "Confirm Email";
      const html: string = template(
        confirmEmailOtp,
        `${user.firstName} ${user.lastName}`,
        subject
      );
      user.emailOtp = {
        otp: confirmEmailOtp,
        expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRATION)),
      };
      await user.save();
      emailEmitter.publish(Events.confirmEmail, {
        to: email,
        subject,
        html,
      });
      successHandler({ res, msg: "Email confirmed successfully", status: 200 });
    } catch (error) {
      next(error);
    }
  };
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password }: loginDTO = req.body;
      const user = await this.userRepo.findUserByEmail(email);
      if (!user) {
        throw new invalidCredentialsError();
      }
      if (!user.isConfirmed) {
        throw new userNotConfirmedError();
      }
      const isMatch = await compareHash(password, user.password);
      if (!isMatch) {
        throw new invalidCredentialsError();
      }
      const jti = nanoid();
      const { accessToken, refreshToken } = generateToken({
        payload: { id: user._id },
      });
      successHandler({
        res,
        msg: "logged in successfully",
        data: { accessToken, refreshToken },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };
  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authorization = req.headers.authorization as string;
      const { user, decodedToken } = await decodeToken({
        authorization,
        tokenType: TokenType.refresh,
      });
      const accessToken = generateAccessToken({
        payload: { id: user._id },
        jwtid: decodedToken.jti,
      });
      successHandler({
        res,
        msg: "refresh token generated successfully",
        data: { accessToken },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };
  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email }: forgotPasswordDTO = req.body;
      const user = await this.userRepo.findUserByEmail(email);
      if (!user) {
        throw new notFoundError();
      }
      if (!user.isConfirmed) {
        throw new userNotConfirmedError();
      }
      if (user.passwordOtp && user.passwordOtp.expiresAt >= new Date()) {
        throw new otpNotExpiredError();
      }
      const forgetPasswordlOtp = generateOTP();
      const subject: string = "Reset Password";
      const html: string = template(
        forgetPasswordlOtp,
        `${user.firstName} ${user.lastName}`,
        subject
      );
      user.passwordOtp = {
        otp: forgetPasswordlOtp,
        expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRATION)),
      };
      await user.save();
      emailEmitter.publish(Events.resetPassword, {
        to: email,
        subject,
        html,
      });
      return successHandler({
        res,
        msg: "Reset Password Email Sent Successfully",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, otp, password }: resetPasswordDTO = req.body;
      const user = await this.userRepo.findUserByEmail(email);
      if (!user) {
        throw new notFoundError();
      }
      if (!user.passwordOtp) {
        throw new invalidCredentialsError();
      }
      if (user.passwordOtp && user.passwordOtp.expiresAt <= new Date()) {
        throw new otpExpiredError();
      }
      const isMatch = await compareHash(otp, user.passwordOtp.otp);
      if (!isMatch) {
        throw new invalidCredentialsError();
      }
      user.password = password
      user.changedCredentialsAt = new Date();
      user.passwordOtp = null;
      await user.save();
      successHandler({ res, msg: "Password Reset Successfully", status: 200 });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthServices;
