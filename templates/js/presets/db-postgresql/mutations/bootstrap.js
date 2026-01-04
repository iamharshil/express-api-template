import { connectPostgres } from '../infra/db/postgres';
import { PostgresUserRepository } from '../infra/repositories/PostgresUserRepository';
import { PostgresApiKeyRepository } from '../infra/repositories/PostgresApiKeyRepository';
import { UserService } from '../modules/user/user.service';
export class Bootstrap {
    static async init(app) {
        // 1. Database Connection
        await connectPostgres();
        // 2. Register Repositories
        const userRepo = new PostgresUserRepository();
        const apiKeyRepo = new PostgresApiKeyRepository();
        // Inject into services
        UserService.setRepository(userRepo);
        // ... other wiring
    }
}
