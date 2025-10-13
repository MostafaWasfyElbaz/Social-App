import { likeUnlikePostSchema } from "./post.validation";
import z from "zod";

export type likeUnlikePostDTO = z.infer<typeof likeUnlikePostSchema>;
