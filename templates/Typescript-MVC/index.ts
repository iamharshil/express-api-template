import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import Database from "./config/Database";
import ApiRoute from "./routes/Api";

// config
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(compression());

// routes
app.use("/api", ApiRoute);
app.all("*", (req, res) => {
	res.status(404).json({
		message: "404, not found",
	});
});

// server
app.listen(PORT, async () => {
	await Database();
	console.log(`Server is running on http://localhost:${PORT}`);
});
