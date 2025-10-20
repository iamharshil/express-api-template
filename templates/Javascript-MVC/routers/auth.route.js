import { Router } from "express";

const authRoute = Router();

authRoute.post("/register");
authRoute.post("/login");
authRoute.post("/verify-email");
authRoute.post("/logout");

export default authRoute;
