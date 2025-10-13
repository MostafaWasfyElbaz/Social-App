import { Router } from "express";
import * as modules from "./modules/index";
const baseRouter = Router();

const routes = {
  user: "/user",
  auth: "/auth",
  post: "/post",
};

baseRouter.use(routes.user, modules.userRouter);
baseRouter.use(routes.auth, modules.authRouter);
baseRouter.use(routes.post, modules.postRouter);

export default baseRouter;
