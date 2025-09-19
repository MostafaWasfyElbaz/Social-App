import { Router } from "express";
import AuthServices from "./auth.service";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { signupSchema } from "./auth.validation";
const router = Router();

const authServices = new AuthServices();

router.post("/signup", validationMiddleware(signupSchema), authServices.signup);

export default router;
