import { model, Schema } from "mongoose";
import { IFriendRequest } from "../../common/interfaces/user/IFriendRequest";
import { Events } from "../../common";
import { emailEmitter } from "../../utils";
import User from "./user.model";

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: String,
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

friendRequestSchema.pre("save", async function (next) {
  if (this.isNew && this.isDirectModified("to")) {
    emailEmitter.publish(Events.general, {
      to: this.email,
      subject: "Taged",
      html: "",
    });
    this.email = undefined;
  }
});
export const FriendRequestModel = model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
