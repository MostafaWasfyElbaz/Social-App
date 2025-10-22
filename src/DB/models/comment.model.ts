import { model, Schema, Types } from "mongoose";
import { IComment, Events } from "../../common";
import { User } from "./user.model";
import { emailEmitter } from "../../utils";

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    tags: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    deletedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  }
);

commentSchema.pre("save", async function (next) {
  if (this.isDirectModified("tags")) {
    const userIds = this.tags?.map((tag) => tag.toString());
    const users = await User.find(
      {
        _id: { $in: userIds },
      },
      { email: 1, _id: 0 }
    );
    users.map((user) =>
      emailEmitter.publish(Events.general, {
        to: user.email,
        subject: "Taged",
        html: "",
      })
    );
  }
  next();
});

commentSchema.pre(["find", "findOne"], async function (next) {
  if (!this.getFilter().paranoid) {
    this.setQuery({ ...this.getQuery() });
    next();
  }
  this.setQuery({ ...this.getQuery(), isDeleted: { $ne: true } });
  next();
});

export const Comment = model<IComment>("Comment", commentSchema);
