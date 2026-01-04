import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { StatusCodes } from 'http-status-codes';
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!env.JWT_SECRET)
            throw new Error('JWT_SECRET not set');
        const decoded = jwt.verify(token, env.JWT_SECRET);
        // Attach to req (needs type extension in global/types)
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};
