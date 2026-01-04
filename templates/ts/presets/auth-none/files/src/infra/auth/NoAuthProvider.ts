import { Request } from 'express';
import { AuthProvider, AuthContext } from '../../shared/auth';

export class NoAuthProvider implements AuthProvider {
    async extractContext(req: Request): Promise<AuthContext> {
        return {
            isAuthenticated: false,
            roles: ['anonymous'],
        };
    }
}
