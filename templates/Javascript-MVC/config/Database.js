const mongoose = require("mongoose");

const Database = async () => {
	try {
		mongoose.set("strictQuery", true);
		await mongoose
			.connect(process.env.MONGO_URI)
			.then(() => console.log("Database connected"))
			.catch((error) => console.log({ message: error.message }));
	} catch (error) {
		console.log({ message: error.message });
	}
};

module.exports = Database;
