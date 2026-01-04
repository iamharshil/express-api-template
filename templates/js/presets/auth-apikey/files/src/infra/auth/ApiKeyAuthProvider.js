// Needs repo injection
export class ApiKeyAuthProvider {
    apiKeyRepo;
    constructor(apiKeyRepo) {
        this.apiKeyRepo = apiKeyRepo;
    }
    async extractContext(req) {
        const key = req.headers['x-api-key'];
        if (!key)
            return { isAuthenticated: false, roles: [] };
        const apiKey = await this.apiKeyRepo.findByKeyHash(key); // Simplified, should hash first
        if (!apiKey)
            return { isAuthenticated: false, roles: [] };
        return {
            isAuthenticated: true,
            userId: apiKey.userId,
            roles: apiKey.scopes, // Mapping scopes to roles for simplicity
        };
    }
}
