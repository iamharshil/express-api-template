import { Application } from 'express';
import { NoAuthProvider } from '../infra/auth/NoAuthProvider';

export class Bootstrap {
    public static async init(app: Application): Promise<void> {
        const authProvider = new NoAuthProvider();
    }
}
