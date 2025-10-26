import z from "zod";
import {
  confirmEmailSchema,
  resendEmailOtpSchema,
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  updateEmailSchema,
  confirmEmailChangeSchema,
  _2FASchema,
  resendUpdateEmailOtpSchema,
} from "./auth.validation";
export type confirmEmailDTO = z.infer<typeof confirmEmailSchema>;
export type resendEmailOtpDTO = z.infer<typeof resendEmailOtpSchema>;
export type signupDTO = z.infer<typeof signupSchema>;
export type loginDTO = z.infer<typeof loginSchema>;
export type resetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type forgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type updateEmailDTO = z.infer<typeof updateEmailSchema>;
export type confirmEmailChangeDTO = z.infer<typeof confirmEmailChangeSchema>;
export type _2FADTO = z.infer<typeof _2FASchema>;
export type resendUpdateEmailOtpDTO = z.infer<
  typeof resendUpdateEmailOtpSchema
>;
