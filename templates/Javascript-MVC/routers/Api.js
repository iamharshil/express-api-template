const express = require("express");
const Router = express.Router();
const ApiController = require("../controllers/ApiController");

Router.get("/", ApiController.index);
Router.post("/create", ApiController.create);
Router.get("/:id", ApiController.read);
Router.put("/:id", ApiController.update);
Router.delete("/:id", ApiController.remove);

module.exports = Router;
