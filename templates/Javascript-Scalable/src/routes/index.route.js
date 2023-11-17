const Router = require("express").Router();
const usersRouter = require("./users.route");

Router.use("/v1/user", usersRouter);

module.exports = Router;
