import { pool } from '../lib/db/postgres';
export const postgresApiKeyRepository = {
    async findByKeyHash(hash) {
        const res = await pool.query('SELECT * FROM api_keys WHERE key_hash = $1', [hash]);
        if (res.rows.length === 0)
            return null;
        const key = res.rows[0];
        return { userId: key.user_id, scopes: key.scopes };
    }
};
