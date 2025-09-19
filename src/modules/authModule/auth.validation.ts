import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(15, "Name must be at most 15 characters long"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .superRefine((arg, ctx) => {
    if (arg.password !== arg.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword", "password"],
        message: "Passwords do not match",
      });
    }
  });
