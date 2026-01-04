import { Request } from 'express';
import { AuthProvider, AuthContext } from '../../shared/auth';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export class JwtAuthProvider implements AuthProvider {
    async extractContext(req: Request): Promise<AuthContext> {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return { isAuthenticated: false, roles: [] };
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
            return {
                isAuthenticated: true,
                userId: decoded.userId,
                roles: decoded.roles || [],
            };
        } catch (err) {
            return { isAuthenticated: false, roles: [] };
        }
    }
}
