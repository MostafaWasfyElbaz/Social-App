import { IPost, PostAvailability, Events, IUser } from "../../common";
import { HydratedDocument, Schema, model } from "mongoose";
import { emailEmitter } from "../../utils";
import { User } from "./user.model";

export const availabilityFilter = (user: HydratedDocument<IUser>) => {
  return [
    {
      availability: PostAvailability.PUBLIC,
    },
    {
      availability: PostAvailability.PRIVATE,
      createdBy: user._id,
    },
    {
      availability: PostAvailability.PRIVATE,
      tags: { $in: [user._id] },
    },
    {
      availability: PostAvailability.FRIENDS,
      createdBy: { $in: [...user.friends, user._id] },
    },
  ];
};

const postSchema = new Schema<IPost>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    attachments: {
      type: [String],
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    assetsFolderId: {
      type: String,
    },
    availability: {
      type: String,
      enum: [
        PostAvailability.FRIENDS,
        PostAvailability.PRIVATE,
        PostAvailability.PUBLIC,
      ],
      default: PostAvailability.PUBLIC,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("save", async function (next) {
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

export const Post = model<IPost>("Post", postSchema);

export type PostModel = HydratedDocument<IPost>;
