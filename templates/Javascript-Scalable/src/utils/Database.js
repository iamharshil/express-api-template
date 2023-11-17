const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/database.config");

const Database = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI);

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
};

module.exports = Database;
