const UserModel = require("../models/User.model");

exports.getAllUsers = async () => {
	try {
		const users = await UserModel.find();
		return users;
	} catch (error) {
		throw new Error(error);
	}
};

exports.getUserById = async (id) => {
	try {
		const user = await UserModel.findById(id);
		return user;
	} catch (error) {
		throw new Error(error);
	}
};

exports.getUserByUsername = async (username) => {
	try {
		const user = await UserModel.findOne({ username });
		return user;
	} catch (error) {
		throw new Error(error);
	}
};

exports.getUerByEmail = async (email) => {
	try {
		const user = await UserModel.findOne({ email });
		return user;
	} catch (error) {
		throw new Error(error);
	}
};

exports.createUser = async (user) => {
	try {
		const newUser = await UserModel.create(user);
		return newUser;
	} catch (error) {
		throw new Error(error);
	}
};

exports.updateUser = async (id, user) => {
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
			new: true,
		});
		return updatedUser;
	} catch (error) {
		throw new Error(error);
	}
};

exports.deleteUser = async (id) => {
	try {
		const deletedUser = await UserModel.findByIdAndDelete(id);
		return deletedUser;
	} catch (error) {
		throw new Error(error);
	}
};
