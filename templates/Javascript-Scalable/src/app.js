const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const app = express();

// configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use(compression());

// routes
app.use("/api", require("./routes/index.route"));
app.all("*", (req, res) => res.status(404).send("404 Not Found"));

module.exports = app;
