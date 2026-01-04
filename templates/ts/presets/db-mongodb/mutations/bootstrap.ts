// This code mimics what would be injected into src/config/bootstrap.ts
import { Application } from 'express';
import { connectMongo } from '../infra/db/mongo';
import { MongoUserRepository } from '../infra/repositories/MongoUserRepository';
import { MongoApiKeyRepository } from '../infra/repositories/MongoApiKeyRepository';
import { UserService } from '../modules/user/user.service';

export class Bootstrap {
    public static async init(app: Application): Promise<void> {
        // 1. Database Connection
        await connectMongo();

        // 2. Register Repositories
        const userRepo = new MongoUserRepository();
        const apiKeyRepo = new MongoApiKeyRepository();

        // Inject into services
        UserService.setRepository(userRepo);

        // ... other wiring
    }
}
