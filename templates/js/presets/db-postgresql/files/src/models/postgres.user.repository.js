import { pool } from '../lib/db/postgres';
export const postgresUserRepository = {
    async findById(id) {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.rows[0] || null;
    },
    async findByEmail(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0] || null;
    },
    async create(user) {
        const res = await pool.query('INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *', [user.email, user.username]);
        return res.rows[0];
    }
};
