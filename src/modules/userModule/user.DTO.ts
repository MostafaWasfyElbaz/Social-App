import z from "zod";
import { acceptFriendRequestSchema, blockUserSchema, deleteFriendRequestSchema, rejectFriendRequestSchema, sendFriendRequestSchema, unfriendSchema } from "./user.validation";



export type sendFriendRequestDTO = z.infer<typeof sendFriendRequestSchema>;
export type acceptFriendRequestDTO = z.infer<typeof acceptFriendRequestSchema>;
export type deleteFriendRequestDTO = z.infer<typeof deleteFriendRequestSchema>;
export type unfriendDTO = z.infer<typeof unfriendSchema>;
export type blockUserDTO = z.infer<typeof blockUserSchema>;
export type rejectFriendRequestDTO = z.infer<typeof rejectFriendRequestSchema>;


