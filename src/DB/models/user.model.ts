import { Schema, model } from "mongoose";
import { IUser, Gender } from "../../common/index";

const usersSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Name is required"],
  },
  gender: {
    type: String,
    enum: Gender,
    default: Gender.male,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  emailOtp: {
    otp: { type: String },
    expiresAt: { type: Date },
  },
  passwordOtp: {
    otp: { type: String },
    expiresAt: { type: Date },
  },
  phone: {
    type: String,
    unique: [true, "Phone number already exists"],
    required: [true, "Phone number is required"],
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  changedCredentialsAt: Date
});

export const User = model<IUser>("User", usersSchema);

export default User;
