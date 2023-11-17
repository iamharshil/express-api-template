import mongoose from "mongoose";
import { MONGO_URI } from "../config/database.config";

export default async function Database() {
	try {
		const conn = await mongoose.connect(MONGO_URI);
		console.log(`Connected to MongoDB: ${conn.connection.host}`);
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error ${error.message}`);
		}
	}
}
