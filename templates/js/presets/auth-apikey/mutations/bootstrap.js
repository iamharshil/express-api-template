// Note: This assumes ApiKeyRepository implementation is available (via DB preset)
export class Bootstrap {
    static async init(app) {
        // ...
        // const apiKeyRepo = ... (from DB preset)
        // const authProvider = new ApiKeyAuthProvider(apiKeyRepo);
    }
}
