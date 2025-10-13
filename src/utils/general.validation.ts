import z from "zod";
import { PostAvailability } from "../common";
import { MimeType } from "./index";

export const generalValidation = {
    content: z.string().optional(),
    files:({Types=MimeType.images,fieldName="attachments"}: {Types?:string[],fieldName?:string}) =>{ return z
      .array(
        z.object({
          fieldname: z.enum([fieldName]),
          originalname: z.string(),
          encoding: z.string(),
          mimetype: z.enum(Types),
          buffer: z.any().optional(),
          path: z.string().optional(),
          size: z.number(),
        })
      )
      .optional()},
    tags: z.array(z.string()).optional(),
    allowComments: z.boolean().optional().default(true),
    availability: z
      .enum([
        PostAvailability.FRIENDS,
        PostAvailability.PRIVATE,
        PostAvailability.PUBLIC,
      ])
      .optional()
      .default(PostAvailability.PUBLIC),
}