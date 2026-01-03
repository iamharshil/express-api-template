import logger from "../lib/logger.js";
import { signupValiation } from "../utils/validations.js";

const AuthController = {
    signup: async (req, res) => {
        try {
            const data = await req.body;
            console.log("data", data);
            const validate = signupValiation.safeParse(data);
            if (!validate.success) {
                return res.status(400).json({ success: false, error: validate.error.flatten().fieldErrors });
            }

            return res.status(200).json({ success: true, message: "Success" });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    login: async (req, res) => {
        try {
            const data = req.body;
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};

export default AuthController;
