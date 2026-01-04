import { Request, Response } from 'express';

export class AuthController {
    public static async login(req: Request, res: Response) {
        // Implementation depends on auth type (JWT, etc.)
        // This might be where we need interfaces or specific preset logic?
        // For base, we can leave it generic or empty.
        res.json({ message: 'Login not implemented in base' });
    }

    public static async register(req: Request, res: Response) {
        res.json({ message: 'Register not implemented in base' });
    }
}
