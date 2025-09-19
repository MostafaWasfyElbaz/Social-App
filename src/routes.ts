import { Router } from "express";
import userRouter from "./modules/userModule/user.controller";
import authRouter from "./modules/authModule/auth.controller";
const baseRouter = Router();

baseRouter.use("/user", userRouter);
baseRouter.use("/auth", authRouter);

export default baseRouter;
