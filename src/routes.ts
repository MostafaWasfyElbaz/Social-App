import { Router } from "express";
import * as modules from "./modules/index";
const baseRouter = Router();

baseRouter.use("/user", modules.userRouter);
baseRouter.use("/auth", modules.authRouter);

export default baseRouter;
