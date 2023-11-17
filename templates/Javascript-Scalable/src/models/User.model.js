import { models, model, Schema } from "mongoose";

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false },
);

export default models.User || model("User", UserSchema);
