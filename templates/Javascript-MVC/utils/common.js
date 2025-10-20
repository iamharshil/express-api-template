import jwt from "jsonwebtoken";
import RESPONSE from "../lib/response";

const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

export const generateToken = (payload, expiresIn = "1h") => {
	try {
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
		return RESPONSE.successData(token);
	} catch (error) {
		console.error("Token generation error:", error);
		return RESPONSE.errorData("Token generation failed");
	}
};

export const verifyToken = (token) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return RESPONSE.successData(decoded);
	} catch (error) {
		console.error("Token verification error:", error);
		return RESPONSE.errorData("Token verification failed");
	}
};
