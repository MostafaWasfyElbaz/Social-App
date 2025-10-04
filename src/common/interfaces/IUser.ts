import { Gender, otpType } from "../index";
import { Document } from "mongoose";

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
  profileImage?: string;
  coverImages?: string[];
}
