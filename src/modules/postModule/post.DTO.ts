import { Types } from "mongoose";
import {  likeUnlikePostSchema, updatePostSchema } from "./post.validation";
import z from "zod";

export type likeUnlikePostDTO = z.infer<typeof likeUnlikePostSchema>;
export type updatePostDTO = z.infer<typeof updatePostSchema>;
