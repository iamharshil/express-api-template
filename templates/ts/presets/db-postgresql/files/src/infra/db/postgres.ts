import { Pool } from 'pg';

export const pool = new Pool({
    connectionString: process.env.DB_URI || 'postgresql://localhost:5432/express_api',
});

export const connectPostgres = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected');
    } catch (error) {
        console.error('PostgreSQL connection error', error);
        process.exit(1);
    }
};
