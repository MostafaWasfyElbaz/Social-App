import { Schema, model } from "mongoose";
import { IUser } from "../../common/index";

const usersSchema = new Schema<IUser>({
  firstName: { type: String, required: [true, "Name is required"] },
  lastName: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  emailOtp: {
    otp: { type: String },
    expiresAt: { type: Date },
  },
  phone: { type: String },
});

const User = model<IUser>("User", usersSchema);

export default User;
