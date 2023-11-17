const mongoose = require("mongoose");
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Database connected"))
	.catch((error) => console.log({ message: error.message }));
