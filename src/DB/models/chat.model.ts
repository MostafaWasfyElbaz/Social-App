import { Schema, model, models } from "mongoose";
import { IChat, IMessage } from "../../common";

const messageSchema = new Schema<IMessage>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Message Created By is required"],
    },
    content: { type: String, required: [true, "Message Content is required"] },
  },
  { timestamps: true }
);

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Chat Participants is required"],
      },
    ],
    messages: [messageSchema],
    groupName: String,
    groupImage: String,
    roomId: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Chat Created By is required"],
    },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model<IChat>("Chat", chatSchema);

