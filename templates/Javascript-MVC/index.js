import "dotenv-safe/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import client from "prom-client";
import xss from "xss";
import Database from "./config/Database.js";
import router from "./routers/index.route.js";

// configuration
const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT is not defined in environment variables");

const app = express();
const register = new client.Registry();

// Metrics setup
client.collectDefaultMetrics({ register });
const httpRequestCount = new client.Counter({
	name: "http_request_total",
	help: "Total number of HTTP requests",
	labelNames: ["method", "route", "status_code"],
});

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 minutes

// security middlewares
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "https://fonts.googleapis.com"],
			fontSrc: ["'self'", "https://fonts.gstatic.com"],
			imgSrc: ["'self'", "data:"],
		},
	}),
);
app.use(cors({ origin: "*", credentials: true }));
app.use(mongoSanitize()); // Removed prohibited characters from req.body, req.query, and req.params

// NOTE: xss-clean is deprecated.
app.use(xss());

// Compression.
app.use(compression());

// CSRF Protection
app.use(csurf({ cookie: true })); // use specific routes if needed

// Prometheus metrics middleware
app.use((req, res, next) => {
	const sanitize = (data) => {
		if (typeof data === "string") return xss(data);
		if (Array.isArray(data)) return data.map(sanitize);
		if (data && typeof data === "object") {
			for (const key in data) data[key] = sanitize(data[key]);
		}
		return data;
	};

	req.body = sanitize(req.body);
	req.query = sanitize(req.query);
	req.params = sanitize(req.params);

	res.on("finish", () => {
		httpRequestCount.inc({
			method: req.method,
			route: req.path,
			status_code: res.statusCode,
		});
	});
	next();
});

// routes
app.get("/health", (_req, res) => {
	return res.status(200).json({ status: "OK" });
});
app.use("/api", router);

// Metrics endpoint
app.get("/metrics", async (_, res) => {
	res.set("Content-Type", register.contentType);
	res.end(await register.metrics());
});
app.all("/*", (_, res) => {
	return res.status(404).json({ message: "Not Found" });
});

app.listen(PORT, async () => {
	await Database();
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
