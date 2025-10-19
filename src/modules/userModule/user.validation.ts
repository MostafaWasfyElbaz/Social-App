import { z } from "zod";
import { generalValidation } from "../../utils";

export const sendFriendRequestSchema = z.object({
  to: generalValidation.to,
});

export const acceptFriendRequestSchema = z.object({
  from: generalValidation.from,
});

export const deleteFriendRequestSchema = z.object({
    to: generalValidation.to,
})

export const unfriendSchema = z.object({
    friendId: generalValidation.to,
})

export const blockUserSchema = z.object({
    to: generalValidation.to,
})

export const rejectFriendRequestSchema = z.object({
    from: generalValidation.from,
})