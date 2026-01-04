import { Application } from 'express';

export class Bootstrap {
    public static async init(app: Application): Promise<void> {
        // 1. Register shared providers (Logger, etc.)

        // 2. Register Repositories (IMPLEMENTED BY PRESETS)
        // Core base implementation might be mocks or throw errors if no preset is selected?
        // Or we leave this empty and let presets INJECT code here.

        // 3. Register Auth Provider (IMPLEMENTED BY PRESETS)

        // 4. Initialize Modules
    }
}
