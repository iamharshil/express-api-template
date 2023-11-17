import { Request, Response } from "express";
import { createUser, getAllUsers, getUserByEmail, getUserById, getUserByUsername, removeUser, updateUser } from "../services/User.services";

export async function getAll(req: Request, res: Response) {
	try {
		const allUsers = await getAllUsers();
		return res.status(200).json({ success: true, data: allUsers });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}
export async function create(req: Request, res: Response) {
	try {
		let existingUser = await getUserByUsername(req.body.username);
		if (existingUser) return res.status(400).json({ success: false, message: "Username already exists" });
		existingUser = await getUserByEmail(req.body.email);
		if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });
		const createdUser = await createUser(req.body);
		return res.status(201).json({ success: true, data: createdUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}
export async function update(req: Request, res: Response) {
	try {
		const updatedUser = await updateUser(req.params.id, req.body);
		return res.status(200).json({ success: true, data: updatedUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}
export async function remove(req: Request, res: Response) {
	try {
		const removedUser = await removeUser(req.params.id);
		return res.status(200).json({ success: true, data: removedUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}
export async function get(req: Request, res: Response) {
	try {
		const user = await getUserById(req.params.id);
		return res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}
