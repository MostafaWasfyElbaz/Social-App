import { HydratedDocument, Schema, model } from "mongoose";
import { IUser, Gender } from "../../common/index";
import { createHash } from "../../utils";

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
  changedCredentialsAt: Date,
  profileImage: String,
  coverImages: [
    {
      type: String,
    },
  ],
});

usersSchema.pre("save", async function (this:HydratedDocument<IUser>&{wasNew:boolean},next) {
  this.wasNew = this.isNew
  if (this.isModified("password")) {
    this.password = await createHash(this.password);
  }
  if (this.isModified("emailOtp")) {
    if (this.emailOtp) {
      this.emailOtp.otp = await createHash(this.emailOtp.otp);
    }
  }
  if (this.isModified("passwordOtp")) {
    if (this.passwordOtp) {
      this.passwordOtp.otp = await createHash(this.passwordOtp.otp);
    }
  }
});

export const User = model<IUser>("User", usersSchema);

export default User;
