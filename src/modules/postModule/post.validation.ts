import { z } from "zod";
import { generalValidation } from "../../utils";

export const createPostSchema = z
  .object({
    content: generalValidation.content,
    files: generalValidation.files({}),
    tags: generalValidation.tags,
    allowComments: generalValidation.allowComments,
    availability: generalValidation.availability,
  })
  .superRefine((data, ctx) => {
    if (!data.content && (!data.files || data.files.length <= 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Content is required",
        path: ["content", "files"],
      });
    }
  });

export const likeUnlikePostSchema = z.object({
    postId: z.string().length(24),
    action: z.enum(["like", "unlike"]),
})

export const checkPostIdSchema = z.object({
    postId: z.string().length(24),
})

export const updatePostSchema = z.object({
    postId: z.string().length(24),
    content: generalValidation.content,
    files: generalValidation.files({}),
    tags: generalValidation.tags,
    allowComments: generalValidation.allowComments,
    availability: generalValidation.availability,
    removedAttachments: z.array(z.string().length(24)),
    removedTags: z.array(z.string().length(24)),
    newTags: z.array(z.string().length(24)),
})
