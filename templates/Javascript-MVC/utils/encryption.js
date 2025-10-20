import argon2 from "argon2";
import RES from "../lib/response.js";

const encryption = {
	encrypt: async (text) => {
		try {
			const hash = await argon2.hash(text);
			return RES.success(hash);
		} catch (error) {
			console.error("Encryption error:", error);
			return RES.error("Encryption failed");
		}
	},
	verify: async (hash, plainText) => {
		try {
			const isMatch = await argon2.verify(hash, plainText);
			if (isMatch) {
				return RES.success(true, "Verification successful");
			} else {
				return RES.error("Verification failed");
			}
		} catch (error) {
			console.error("Verification error:", error);
			return RES.error("Verification process failed");
		}
	},
};
export default encryption;
