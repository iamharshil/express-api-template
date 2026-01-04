import { Request } from 'express';
import { AuthProvider, AuthContext } from '../../shared/auth';
import { ApiKeyRepository } from '../../shared/repositories/ApiKeyRepository';

// Needs repo injection
export class ApiKeyAuthProvider implements AuthProvider {
    constructor(private apiKeyRepo: ApiKeyRepository) { }

    async extractContext(req: Request): Promise<AuthContext> {
        const key = req.headers['x-api-key'] as string;
        if (!key) return { isAuthenticated: false, roles: [] };

        const apiKey = await this.apiKeyRepo.findByKeyHash(key); // Simplified, should hash first
        if (!apiKey) return { isAuthenticated: false, roles: [] };

        return {
            isAuthenticated: true,
            userId: apiKey.userId,
            roles: apiKey.scopes, // Mapping scopes to roles for simplicity
        };
    }
}
