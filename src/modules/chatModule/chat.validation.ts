import z from "zod";
import { generalValidation } from "../../utils";

export const getChatSchema = z.object({
  userId: generalValidation.id,
});
export const sendMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),
  sendTo: generalValidation.id,
});