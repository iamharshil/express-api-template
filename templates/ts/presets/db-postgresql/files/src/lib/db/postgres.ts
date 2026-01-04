import { Pool } from 'pg';
import { env } from '../../config/env';

export const pool = new Pool({
    connectionString: env.DB_URI,
});

export const connectPostgres = async () => {
    try {
        if (!env.DB_URI) throw new Error("DB_URI is not defined");
        await pool.connect();
        console.log('Connected to PostgreSQL');
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        process.exit(1);
    }
};
