import z from "zod";

export const createCommentSchema = z.object({
    content:z.string().min(1).max(1000),
    postId:z.string().length(24),
    tags:z.array(z.string()).optional(),
});

export const checkPostIdSchema = z.object({
    postId:z.string().length(24),
});

export const updateCommentSchema = z.object({
    commentId:z.string().length(24),
    content:z.string().min(1).max(1000),
    newTags:z.array(z.string()).optional(),
    removedTags:z.array(z.string()).optional(),
});
