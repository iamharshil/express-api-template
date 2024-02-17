import http from "http";
import app from "./app";
import { PORT } from "./config/server.config";
import Database from "./utils/Database";

// server
const server = http.createServer(app);

// listen
server.listen(PORT, async () => {
	await Database();
	console.log(`Server listening on port http://localhost:${PORT}`);
});
