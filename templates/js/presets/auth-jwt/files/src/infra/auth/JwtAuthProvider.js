import jwt from 'jsonwebtoken';
export class JwtAuthProvider {
    async extractContext(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return { isAuthenticated: false, roles: [] };
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            return {
                isAuthenticated: true,
                userId: decoded.userId,
                roles: decoded.roles || [],
            };
        }
        catch (err) {
            return { isAuthenticated: false, roles: [] };
        }
    }
}
