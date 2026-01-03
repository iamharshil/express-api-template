import http from "node:http";
import env from "./confg/env.js";
import logger from "./lib/logger.js";
import connectMongo from "./confg/database.js";
import app from "./app.js";

const server = http.createServer(app);

connectMongo().then(async () => {
    server.listen(env.PORT, () => {
        logger.info(`Server is running on port ${env.PORT}`);
    });
});
