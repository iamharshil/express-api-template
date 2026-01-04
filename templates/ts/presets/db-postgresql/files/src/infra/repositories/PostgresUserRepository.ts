import { UserRepository, User } from '../../shared/repositories/UserRepository';
import { pool } from '../db/postgres';

export class PostgresUserRepository implements UserRepository {
    async findById(id: string): Promise<User | null> {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.rows[0] ? this.map(res.rows[0]) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0] ? this.map(res.rows[0]) : null;
    }

    async create(user: Partial<User>): Promise<User> {
        const res = await pool.query(
            'INSERT INTO users (email, password_hash, roles) VALUES ($1, $2, $3) RETURNING *',
            [user.email, user.passwordHash, user.roles]
        );
        return this.map(res.rows[0]);
    }

    private map(row: any): User {
        return {
            id: row.id.toString(),
            email: row.email,
            passwordHash: row.password_hash,
            roles: row.roles,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
