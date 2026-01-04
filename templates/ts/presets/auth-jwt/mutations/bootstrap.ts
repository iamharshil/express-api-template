import { Application } from 'express';
import { JwtAuthProvider } from '../infra/auth/JwtAuthProvider';

export class Bootstrap {
    public static async init(app: Application): Promise<void> {
        // ... previous wiring

        // 3. Register Auth Provider
        const authProvider = new JwtAuthProvider();
        // Register it globally or in a middleware

    }
}
