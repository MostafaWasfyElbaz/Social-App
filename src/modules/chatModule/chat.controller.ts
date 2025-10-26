import { Router } from "express";
import ChatRestServices from "./chat.rest.service";
import { auth } from "../../middleware";
import { validationMiddleware } from "../../middleware";
import { getChatSchema } from "./chat.validation";
const router = Router({
  mergeParams: true,
});
const chatRestServices = new ChatRestServices();

const routes = {
  getChat: "/",
};

router.get(
  routes.getChat,
  auth(),
  validationMiddleware(getChatSchema),
  chatRestServices.getChat
);
export default router;
