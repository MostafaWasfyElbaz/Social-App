import { createGroupSchema, getChatSchema, getGroupChatSchema } from "./chat.validation";
import z from "zod";

export type GetChatDTO = z.infer<typeof getChatSchema>;
export type CreateGroupDTO = z.infer<typeof createGroupSchema>;
export type GetGroupChatDTO = z.infer<typeof getGroupChatSchema>;
