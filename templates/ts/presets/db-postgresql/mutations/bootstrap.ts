// This code mimics what would be injected into src/config/bootstrap.ts
import { Application } from 'express';
import { connectPostgres } from '../infra/db/postgres';
import { PostgresUserRepository } from '../infra/repositories/PostgresUserRepository';
import { PostgresApiKeyRepository } from '../infra/repositories/PostgresApiKeyRepository';
import { UserService } from '../modules/user/user.service';

export class Bootstrap {
    public static async init(app: Application): Promise<void> {
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
