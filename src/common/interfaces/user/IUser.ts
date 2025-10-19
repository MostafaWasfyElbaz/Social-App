import { Gender, IOtp } from "../../index";
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  gender?: Gender;
  password: string;
  emailOtp?: IOtp | undefined;
  passwordOtp?: IOtp | undefined;
  phone: string;
  isConfirmed: boolean;
  changedCredentialsAt: Date;
  profileImage?: string;
  coverImages?: string[];
  tempEmail?: string | undefined;
  tempEmailOtp?: IOtp | undefined;
  _2FA?: boolean;
  friends: Types.ObjectId[];
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId | undefined;
  blockList: Types.ObjectId[];
}
