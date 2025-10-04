import { HydratedDocument, Schema, model } from "mongoose";
import { IUser, Gender,Events } from "../../common/index";
import { createHash, emailEmitter,generateOTP,template} from "../../utils";

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

usersSchema.pre(
  "save",
  async function (this: HydratedDocument<IUser> & { wasNew: boolean }, next) {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
      this.password = await createHash(this.password);
    }
    if (this.isModified("passwordOtp")) {
      if (this.passwordOtp) {
        this.passwordOtp.otp = await createHash(this.passwordOtp.otp);
      }
    }
  }
);

usersSchema.post(
  "save",
  async function (doc, next) {
    const that = this as HydratedDocument<IUser> & { wasNew: boolean };
    if (that.wasNew) {
      const otp = generateOTP();
      emailEmitter.publish(Events.confirmEmail, {
        to: that.email,
        subject: "Confirm Email",
        html: template(otp, `${that.firstName} ${that.lastName}`, "Confirm Email"),
      });
      that.emailOtp = {
        otp: await createHash(otp),
        expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRATION)),
      };
      await that.save();
    }
    console.log(this.isModified("password"));
  }
);

export const User = model<IUser>("User", usersSchema);

export default User;
