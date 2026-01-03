import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index.route.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
    }),
);
app.use(
    cors({
        origin: "*",
        methods: "GET, PUT, POST, DELETE",
    }),
);
app.use(hpp());
app.use(cookieParser());

app.use("/api", router);
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.all("/*path", errorHandler);

export default app;
