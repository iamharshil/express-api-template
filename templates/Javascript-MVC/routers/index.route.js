import express from "express";
import authRoute from "./auth.route";

const router = express.Router();

router.use("/auth", authRoute);

export default router;
