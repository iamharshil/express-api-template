const { getAllUsers, createUser, updateUser, deleteUser, getUserByUsername, getUserById } = require("../services/users.services");

module.exports.getAll = async (req, res) => {
	try {
		const allUsers = await getAllUsers();
		return res.status(200).json({ success: true, data: allUsers });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};
module.exports.create = async (req, res) => {
	try {
		let existingUser = await getUserById(req.body.email);
		if (existingUser) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}
		existingUser = await getUserByUsername(req.body.username);
		if (existingUser) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}
		const newUser = await createUser(req.body);
		return res.status(200).json({ success: true, data: newUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};
module.exports.update = async (req, res) => {
	try {
		const updatedUser = await updateUser(req.params.id, req.body);
		return res.status(200).json({ success: true, data: updatedUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};
module.exports.remove = async (req, res) => {
	try {
		const deletedUser = await deleteUser(req.params.id);
		return res.status(200).json({ success: true, data: deletedUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};
module.exports.get = async (req, res) => {
	try {
		const user = await getUserById(req.params.id);
		return res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};
