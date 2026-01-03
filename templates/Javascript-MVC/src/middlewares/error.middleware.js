export default function errorHandler(error, _, res, next) {
    if (error) {
        return res.json({ success: false, message: "Internal server error!" });
    }

    next();
}
