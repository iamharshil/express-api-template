import mongoose from "mongoose";

const ApiSchema = new mongoose.Schema({
	// ... your code here
});

export default mongoose.models.Api || mongoose.model("Api", ApiSchema);
