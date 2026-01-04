import { ApiKeyRepository, ApiKey } from '../../shared/repositories/ApiKeyRepository';
import { pool } from '../db/postgres';

export class PostgresApiKeyRepository implements ApiKeyRepository {
    async findByKeyHash(hash: string): Promise<ApiKey | null> {
        const res = await pool.query('SELECT * FROM api_keys WHERE key_hash = $1', [hash]);
        return res.rows[0] ? this.map(res.rows[0]) : null;
    }

    async create(apiKey: Partial<ApiKey>): Promise<ApiKey> {
        const res = await pool.query(
            'INSERT INTO api_keys (key_hash, user_id, scopes) VALUES ($1, $2, $3) RETURNING *',
            [apiKey.keyHash, apiKey.userId, apiKey.scopes]
        );
        return this.map(res.rows[0]);
    }

    private map(row: any): ApiKey {
        return {
            id: row.id.toString(),
            keyHash: row.key_hash,
            userId: row.user_id,
            scopes: row.scopes,
            createdAt: row.created_at,
        };
    }
}
