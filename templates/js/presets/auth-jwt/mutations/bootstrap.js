import { JwtAuthProvider } from '../infra/auth/JwtAuthProvider';
export class Bootstrap {
    static async init(app) {
        // ... previous wiring
        // 3. Register Auth Provider
        const authProvider = new JwtAuthProvider();
        // Register it globally or in a middleware
    }
}
