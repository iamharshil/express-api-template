import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
	{
		name: {
			type: String,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: String,
	},
	{ timestamps: true, versionKey: false },
);

export default models.User || model("User", UserSchema);
