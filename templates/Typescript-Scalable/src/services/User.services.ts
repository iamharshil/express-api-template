import UserModel from "../models/User.model";
import { IUser } from "../types/user.types";

export async function getAllUsers() {
	try {
		return await UserModel.find();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}

export async function getUserById(id: string) {
	try {
		return await UserModel.findById(id);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}

export async function getUserByUsername(username: string) {
	try {
		return await UserModel.findOne({ username });
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}
export async function getUserByEmail(email: string) {
	try {
		return await UserModel.findOne({ email });
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}

export async function createUser(user: IUser) {
	try {
		return await UserModel.create(user);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}
export async function updateUser(id: string, user: IUser) {
	try {
		return await UserModel.findByIdAndUpdate(id, user, { new: true });
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}
export async function removeUser(id: string) {
	try {
		return await UserModel.findByIdAndDelete(id);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
}
