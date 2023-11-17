require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const Database = require("./config/Database");

// config
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(compression());

// routes
app.use("/api", require("./routers/Api"));
app.all("/*", (req, res) => res.status(404).json({ message: "Not Found" }));

app.listen(PORT, async () => {
	await Database();
	console.log(`Server is running on http://localhost:${PORT}`);
});
