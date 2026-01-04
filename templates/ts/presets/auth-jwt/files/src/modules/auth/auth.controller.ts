import { Request, Response } from 'express';
import * as UserService from '../user/user.service';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// This replaces the base stub
// This replaces the base stub
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // In a real app, verify password hash.
    // Here we just find user.
    // Note: UserService needs to be wired.

    // For template demo purposes:
    if (email === 'admin@example.com' && password === 'admin') {
        const token = jwt.sign({ userId: '1', roles: ['admin'] }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
};

export const register = async (req: Request, res: Response) => {
    // Implementation for registration
    res.json({ message: 'User registered' });
};
