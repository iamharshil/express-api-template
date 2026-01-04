import { z } from 'zod';
import dotenv from 'dotenv-safe';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    DB_URI: z.string().optional(),
    JWT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
