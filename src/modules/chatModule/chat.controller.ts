import { Router } from "express";
import ChatRestServices from "./chat.rest.service";
import { auth } from "../../middleware";
import { validationMiddleware } from "../../middleware";
import {
  getChatSchema,
  createGroupSchema,
  getGroupChatSchema,
} from "./chat.validation";
const router = Router();
const chatRestServices = new ChatRestServices();

const routes = {
  getChat: "/",
  createGroup: "/create-group",
  getGroupChat: "/group/:groupId",
};

router.get(
  routes.getGroupChat,
  auth(),
  validationMiddleware(getGroupChatSchema),
  chatRestServices.getGroupChat
);
router.get(
  routes.getChat,
  auth(),
  validationMiddleware(getChatSchema),
  chatRestServices.getChat
);

router.post(
  routes.createGroup,
  auth(),
  validationMiddleware(createGroupSchema),
  chatRestServices.createGroup
);

export default router;
