import { getChatSchema } from "./chat.validation";
import z from "zod";

export type GetChatDTO = z.infer<typeof getChatSchema>;
