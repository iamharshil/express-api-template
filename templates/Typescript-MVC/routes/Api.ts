import express from "express";
const Router = express.Router();
import * as ApiController from "../controllers/ApiController";

Router.get("/", ApiController.all);
Router.post("/create", ApiController.create);
Router.get("/:id", ApiController.read);
Router.put("/:id", ApiController.update);
Router.delete("/:id", ApiController.remove);

export default Router;
