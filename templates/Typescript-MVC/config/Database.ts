import mongoose, { ConnectOptions } from "mongoose";

async function Database() {
	mongoose.set("strictQuery", true);
	const URL = process.env.MONG_URL || "";
	return mongoose.connect(
		URL,
		{
			useUnifiedTopology: true,
		} as ConnectOptions,
		(error) => {
			if (error) {
				return console.log({ error: error.message });
			}
			console.log("Database connected");
		},
	);
}

export default Database;
