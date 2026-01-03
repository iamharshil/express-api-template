import mongoose from "mongoose";
import logger from "../lib/logger.js";
import env from "./env.js";

if (!env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in environment variable!");
}

export default async function connectMongo() {
    try {
        const db = await mongoose.connect(env.MONGODB_URI);
        logger.info(db.connection.host);

        logger.info(`Database connected to ${db.connection.host}`);
    } catch (error) {
        const message = error?.message || "Failed to connect database.!!";
        logger.error(message);
        throw new Error(message);
    }
}
