"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../DB/index");
const index_2 = require("../../common/index");
const index_3 = require("../../utils/index");
const nanoid_1 = require("nanoid");
const index_4 = require("../../middleware/index");
class AuthServices {
    userRepo;
    constructor(userRepo = new index_1.UserRepository()) {
        this.userRepo = userRepo;
    }
    signup = async (req, res, next) => {
        try {
            const { firstName, lastName, email, password, gender, phone } = req.body;
            const user = await this.userRepo.createUser({
                firstName,
                lastName,
                email,
                password,
                gender: gender || index_2.Gender.male,
                phone,
            });
            if (!user) {
                throw new index_3.failedToCreateUser();
            }
            return (0, index_3.successHandler)({
                res,
                msg: "User created successfully",
                status: 201,
            });
        }
        catch (error) {
            next(error);
        }
    };
    confirmEmail = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const user = await this.userRepo.findUserByEmail(email);
            if (!user) {
                throw new index_3.notFoundError();
            }
            if (user?.isConfirmed || !user.emailOtp) {
                throw new index_3.userAlreadyConfirmedError();
            }
            if (user.emailOtp.expiresAt <= new Date()) {
                throw new index_3.otpExpiredError();
            }
            const isMatch = await (0, index_3.compareHash)(otp, user.emailOtp.otp);
            if (!isMatch) {
                throw new index_3.invalidCredentialsError();
            }
            user.isConfirmed = true;
            user.emailOtp = null;
            await user.save();
            (0, index_3.successHandler)({ res, msg: "Email confirmed successfully", status: 200 });
        }
        catch (error) {
            next(error);
        }
    };
    resendEmailOtp = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await this.userRepo.findUserByEmail(email);
            if (!user) {
                throw new index_3.notFoundError();
            }
            if (user?.isConfirmed || !user.emailOtp) {
                throw new index_3.userAlreadyConfirmedError();
            }
            if (user.emailOtp.expiresAt >= new Date()) {
                throw new index_3.otpNotExpiredError();
            }
            const confirmEmailOtp = (0, index_3.generateOTP)();
            const subject = "Confirm Email";
            const html = (0, index_3.template)(confirmEmailOtp, `${user.firstName} ${user.lastName}`, subject);
            user.emailOtp = {
                otp: confirmEmailOtp,
                expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRATION)),
            };
            await user.save();
            index_3.emailEmitter.publish(index_2.Events.confirmEmail, {
                to: email,
                subject,
                html,
            });
            (0, index_3.successHandler)({ res, msg: "Email confirmed successfully", status: 200 });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await this.userRepo.findUserByEmail(email);
            if (!user) {
                throw new index_3.invalidCredentialsError();
            }
            if (!user.isConfirmed) {
                throw new index_3.userNotConfirmedError();
            }
            const isMatch = await (0, index_3.compareHash)(password, user.password);
            if (!isMatch) {
                throw new index_3.invalidCredentialsError();
            }
            const jti = (0, nanoid_1.nanoid)();
            const { accessToken, refreshToken } = (0, index_3.generateToken)({
                payload: { id: user._id },
            });
            (0, index_3.successHandler)({
                res,
                msg: "logged in successfully",
                data: { accessToken, refreshToken },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const authorization = req.headers.authorization;
            const { user, decodedToken } = await (0, index_4.decodeToken)({
                authorization,
                tokenType: index_2.TokenType.refresh,
            });
            const accessToken = (0, index_3.generateAccessToken)({
                payload: { id: user._id },
                jwtid: decodedToken.jti,
            });
            (0, index_3.successHandler)({
                res,
                msg: "refresh token generated successfully",
                data: { accessToken },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await this.userRepo.findUserByEmail(email);
            if (!user) {
                throw new index_3.notFoundError();
            }
            if (!user.isConfirmed) {
                throw new index_3.userNotConfirmedError();
            }
            if (user.passwordOtp && user.passwordOtp.expiresAt >= new Date()) {
                throw new index_3.otpNotExpiredError();
            }
            const forgetPasswordlOtp = (0, index_3.generateOTP)();
            const subject = "Reset Password";
            const html = (0, index_3.template)(forgetPasswordlOtp, `${user.firstName} ${user.lastName}`, subject);
            user.passwordOtp = {
                otp: forgetPasswordlOtp,
                expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRATION)),
            };
            await user.save();
            index_3.emailEmitter.publish(index_2.Events.resetPassword, {
                to: email,
                subject,
                html,
            });
            return (0, index_3.successHandler)({
                res,
                msg: "Reset Password Email Sent Successfully",
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const { email, otp, password } = req.body;
            const user = await this.userRepo.findUserByEmail(email);
            if (!user) {
                throw new index_3.notFoundError();
            }
            if (!user.passwordOtp) {
                throw new index_3.invalidCredentialsError();
            }
            if (user.passwordOtp && user.passwordOtp.expiresAt <= new Date()) {
                throw new index_3.otpExpiredError();
            }
            const isMatch = await (0, index_3.compareHash)(otp, user.passwordOtp.otp);
            if (!isMatch) {
                throw new index_3.invalidCredentialsError();
            }
            user.password = password;
            user.changedCredentialsAt = new Date();
            user.passwordOtp = null;
            await user.save();
            (0, index_3.successHandler)({ res, msg: "Password Reset Successfully", status: 200 });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = AuthServices;
