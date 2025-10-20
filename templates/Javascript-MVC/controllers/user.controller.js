import RESPONSE from "../lib/response.js";
import User from "../models/User.model.js";
import { generateToken } from "../utils/common.js";
import encryption from "../utils/encryption.js";
import { LoginSchema, RegisterSchema, VerifyEmailSchema } from "../utils/validation.js";

const UserController = {
	Register: async (req, res) => {
		try {
			const data = req.body;

			const validate = RegisterSchema.parse(data);
			if (!validate.success) {
				return RESPONSE.error(res, "Validation failed", validate.errors);
			}

			const existingUser = await User.findOne({ email: data.email });
			if (existingUser) {
				return RESPONSE.error(res, "Email already in use");
			}

			const hashedPassword = await encryption.hashPassword(data.password);
			if (!hashedPassword.success) {
				return RESPONSE.error(res, "Password hashing failed");
			}

			const newUser = new User({
				email: data.email,
				password: hashedPassword.data,
				name: data.name,
			});
			await newUser.save();

			return RESPONSE.success(res, "User registered successfully");
		} catch (err) {
			return RESPONSE.error(res, "User registration failed", err.message);
		}
	},
	VerifyEmail: async (req, res) => {
		try {
			const { email } = req.body;

			const validate = VerifyEmailSchema.parse({ email });
			if (!validate.success) {
				return RESPONSE.error(res, "Validation failed", validate.errors);
			}

			const user = await User.findOne({ email });
			if (!user) {
				return RESPONSE.success(res, "Email does not exist", { exists: false });
			}

			user.verified = true;
			await user.save();

			return RESPONSE.success(res, "Email verification successful");
		} catch (err) {
			return RESPONSE.error(res, "Email verification failed", err.message);
		}
	},
	Login: async (req, res) => {
		try {
			const { email, password } = req.body;

			const validate = await LoginSchema.parseAsync({ email, password });
			if (!validate.success) {
				return RESPONSE.error(res, "Validation failed", validate.errors);
			}

			const user = await User.findOne({ email });
			if (!user) {
				return RESPONSE.error(res, "Invalid email or password");
			}
			const isMatch = await user.comparePassword(password);
			if (!isMatch) {
				return RESPONSE.error(res, "Invalid email or password");
			}

			// Here you would typically generate a JWT or session
			const token = generateToken({ id: user._id, email: user.email });
			if (!token.success) {
				return RESPONSE.error(res, "Token generation failed");
			}

			// set cookie; use secure only in production or when the request is secure
			const cookieOptions = {
				httpOnly: true,
				secure: req.secure || process.env.NODE_ENV === "production",
				sameSite: "Strict",
			};
			res.cookie("token", token.data, cookieOptions);
			return RESPONSE.success(res, "Login successful");
		} catch (err) {
			return RESPONSE.error(res, "Login failed", err.message);
		}
	},
	Logout: async (_req, res) => {
		try {
			res.clearCookie("token");
			return res.status(200).json({ message: "Logout successful" });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
};

export default UserController;
