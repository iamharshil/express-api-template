require("dotenv").config();

module.exports = {
	MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1/express-api-template",
};
