import { Router } from "express";
const userRouter = Router();
import * as userController from "../controllers/user.controller";

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.get);
userRouter.post("/", userController.create);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id", userController.remove);

export default userRouter;
