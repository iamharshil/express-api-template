import mongoose, { ConnectOptions } from "mongoose";

async function Database() {
	const URL = process.env.MONGO_URI || "";
	return mongoose.connect(
		URL,
		{
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions,
		function (error) {
			if (error) {
				return console.log({ error: error.message });
			}
			console.log("Database connected");
		},
	);
}

export default Database;
