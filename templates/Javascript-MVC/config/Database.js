import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
	throw new Error("Please define the MONGO_URI environment variable inside .env");
}

let cached = global.mongoose;
if (!cached) {
	global.mongoose = { conn: null, promise: null };
	cached = global.mongoose;
}

const Database = async () => {
	try {
		mongoose.set("strictQuery", true);

		if (cached.conn) {
			return cached.conn;
		}

		if (!cached.promise) {
			cached.promise = mongoose
				.connect(MONGO_URI)
				.then(() => {
					console.log("🚀 Database connected successfully");
					cached.conn = mongoose;
					return cached.conn;
				})
				.catch((error) => {
					cached.promise = null;
					console.log({ message: error.message });
					throw error;
				});
		}

		return cached.promise;
	} catch (error) {
		console.log({ message: error.message });
		throw error;
	}
};

export default Database;
