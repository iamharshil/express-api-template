import { NoAuthProvider } from '../infra/auth/NoAuthProvider';
export class Bootstrap {
    static async init(app) {
        const authProvider = new NoAuthProvider();
    }
}
