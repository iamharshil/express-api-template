const UserController = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/", UserController.getAll);
usersRouter.get("/:id", UserController.get);
usersRouter.post("/create", UserController.create);
usersRouter.put("/update/:id", UserController.update);
usersRouter.delete("/delete/:id", UserController.remove);

usersRouter.module.exports = usersRouter;
