import dotenv from "dotenv-safe";

dotenv.config({
    example: ".env.example",
});

const env = {
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI,
};

export default env;
