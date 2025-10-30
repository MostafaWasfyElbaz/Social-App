import { Router } from "express";
import * as modules from "./modules/index";
const baseRouter = Router();

const routes = {
  user: "/user",
  auth: "/auth",
  post: "/post",
  comment: "/comment",
  chat: "/chat",
};

baseRouter.use(routes.chat,modules.chatRouter);
baseRouter.use(routes.user, modules.userRouter);
baseRouter.use(routes.auth, modules.authRouter);
baseRouter.use(routes.post, modules.postRouter);
baseRouter.use(routes.comment, modules.commentRouter);
export default baseRouter;
