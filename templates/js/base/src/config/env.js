import { z } from 'zod';
import dotenv from 'dotenv-safe';
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    // Add other env vars here (e.g., DB_URI, JWT_SECRET) but keep them optional in base
    // Presets might add validation rules here in the future via logic we haven't defined yet, 
    // or we just keep it loose in the base.
});
export const env = envSchema.parse(process.env);
