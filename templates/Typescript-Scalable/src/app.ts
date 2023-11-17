import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./routes/index.route";

// configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use(compression());

// routes
app.use("/api", router);
app.all("*", (req, res) => {
	return res.status(404).json({ success: false, message: "404 not found!" });
});

export default app;
