import { Router } from "express";
import AuthServices from "./auth.service";
import { validationMiddleware } from "../../middleware/index";
import { confirmEmailSchema, resendEmailOtpSchema, signupSchema, loginSchema, resetPasswordSchema } from "./auth.validation";
import { IAuthServices } from "../../common/index";
const router = Router();

const authServices: IAuthServices = new AuthServices();

router.post("/signup", validationMiddleware(signupSchema), authServices.signup);
router.post("/login", validationMiddleware(loginSchema), authServices.login);
router.post("/refresh-token",authServices.refreshToken);

router.patch("/confirm-email", validationMiddleware(confirmEmailSchema), authServices.confirmEmail);
router.patch("/resend-email-otp", validationMiddleware(resendEmailOtpSchema), authServices.resendEmailOtp);
router.patch("/forgot-password", validationMiddleware(resetPasswordSchema), authServices.forgotPassword);
export default router;
