const mongoose = require("mongoose");

const ApiSchema = mongoose.Schema({
	// ... Your model here
});

module.exports = mongoose.model("Api", ApiSchema);
