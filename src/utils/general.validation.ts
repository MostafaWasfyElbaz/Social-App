import z from "zod";
import { PostAvailability } from "../common";
import { MimeType } from "./index";

export const generalValidation = {
  to: z.string().length(24),
  from: z.string().length(24),
  content: z.string().optional(),
  files: ({
    Types = MimeType.images,
    fieldName = "attachments",
  }: {
    Types?: string[];
    fieldName?: string;
  }) => {
    return z
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
      .optional();
  },
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
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(15, "Name must be at most 15 characters long"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  _2FA: z.boolean().optional().default(false),
  otp: z.string().min(6, "OTP must be at least 6 characters long"),
  id: z.string().length(24),
};
