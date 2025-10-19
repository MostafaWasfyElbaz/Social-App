import { updateCommentSchema } from "./comment.validation";
import { z } from "zod";


export type updateCommentDTO = z.infer<typeof updateCommentSchema>