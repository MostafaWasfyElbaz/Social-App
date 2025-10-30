import z from "zod";
import { generalValidation } from "../../utils";

export const getChatSchema = z.object({
  userId: generalValidation.id,
});
export const sendMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),
  sendTo: generalValidation.id,
});
export const createGroupSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  participants: z.array(generalValidation.id),
});
export const getGroupChatSchema = z.object({
  groupId: generalValidation.id,
});