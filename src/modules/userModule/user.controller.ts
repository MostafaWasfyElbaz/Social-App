import { Router } from "express";
import UserServices from "./user.service";
const router = Router();

const userServices = new UserServices();

export default router;
