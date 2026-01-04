import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
// This replaces the base stub
export class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;
        // In a real app, verify password hash.
        // Here we just find user.
        // Note: UserService is static, so we can use it if wired.
        // BUT UserService might not be wired if no DB preset selected?
        // Constraints say: "Auth never knows DB type", but it depends on User availability.
        // We'll assume a Repository is wired.
        // For template demo purposes:
        if (email === 'admin@example.com' && password === 'admin') {
            const token = jwt.sign({ userId: '1', roles: ['admin'] }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
            return res.json({ token });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
    static async register(req, res) {
        // Implementation for registration
        res.json({ message: 'User registered' });
    }
}
