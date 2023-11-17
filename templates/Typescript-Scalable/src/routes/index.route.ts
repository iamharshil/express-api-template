import { Router } from "express";
import userRouter from "./user.router";
const router = Router();

router.use("/v1/user", userRouter);

export default router;
