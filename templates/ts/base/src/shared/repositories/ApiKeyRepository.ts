export interface ApiKey {
    id: string;
    keyHash: string;
    userId?: string;
    scopes: string[];
    createdAt: Date;
}

export interface ApiKeyRepository {
    findByKeyHash(hash: string): Promise<ApiKey | null>;
    create(apiKey: Partial<ApiKey>): Promise<ApiKey>;
}
