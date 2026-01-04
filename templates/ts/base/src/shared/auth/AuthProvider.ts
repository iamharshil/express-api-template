import { Request } from 'express';
import { AuthContext } from './AuthContext';

export interface AuthProvider {
    extractContext(req: Request): Promise<AuthContext>;
}
