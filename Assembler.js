import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Assembler {
    constructor(projectPath, options) {
        this.projectPath = projectPath;
        this.options = options;

        // Dynamic template paths based on language
        const langDir = options.language === 'typescript' ? 'ts' : 'js';
        this.basePath = path.join(__dirname, 'templates', langDir, 'base');
        this.presetsPath = path.join(__dirname, 'templates', langDir, 'presets');

        this.onStateChange = options.onStateChange || (() => { });

        // Dependency maps for presets (Since we don't have package.json in per-preset yet, we map manually)
        this.dependencies = {
            'db-mongodb': { 'mongoose': '^8.3.0' },
            'db-postgresql': { 'pg': '^8.11.0', '@types/pg': '^8.11.0' },
            'auth-jwt': { 'jsonwebtoken': '^9.0.0', '@types/jsonwebtoken': '^9.0.0' },
            'auth-apikey': {},
            'auth-none': {},
            'mvc': {}
        };
    }

    async assemble() {
        // 1. Copy Base
        this.onStateChange('Copying base template...');
        this.copyDir(this.basePath, this.projectPath);

        // 2. Apply Presets
        this.onStateChange('Applying presets...');
        if (this.options.database) {
            this.applyPreset(`db-${this.options.database}`);
        }
        if (this.options.auth) {
            this.applyPreset(`auth-${this.options.auth}`);
        }
        // MVC is structure, could be a preset or just logic. 
        // For now treating as preset if selected or implied.
        if (this.options.structure === 'MVC') {
            this.applyPreset('mvc');
        }

        // 3. Merge Dependencies
        this.onStateChange('Merging dependencies...');
        this.mergeDependencies();

        // 4. Generate Bootstrap
        this.onStateChange('Generating bootstrap...');
        this.generateBootstrap();

        // 5. Generate .env.example
        this.onStateChange('Generating .env.example...');
        this.generateEnvExample();

        // 6. Handle Language (No longer needed as we use pre-transpiled templates)
    }

    applyPreset(presetName) {
        const presetPath = path.join(this.presetsPath, presetName, 'files');
        if (fs.existsSync(presetPath)) {
            this.copyDir(presetPath, this.projectPath);
        }
    }

    copyDir(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                this.copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    mergeDependencies() {
        const pkgPath = path.join(this.projectPath, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        const addDeps = (preset) => {
            const deps = this.dependencies[preset];
            if (!deps) return;
            for (const [name, version] of Object.entries(deps)) {
                // If JS, skip @types
                if (this.options.language === 'javascript' && name.startsWith('@types')) {
                    continue;
                }

                if (name.startsWith('@types')) {
                    pkg.devDependencies[name] = version;
                } else {
                    pkg.dependencies[name] = version;
                }
            }
        };

        if (this.options.database) addDeps(`db-${this.options.database}`);
        if (this.options.auth) addDeps(`auth-${this.options.auth}`);

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    generateBootstrap() {
        const db = this.options.database; // mongodb | postgresql
        const auth = this.options.auth;   // jwt | apikey | none
        const isTS = this.options.language === 'typescript';

        let imports = [];
        let setupLines = [];

        // DB Setup
        if (db === 'mongodb') {
            imports.push(`import { connectMongo } from '../lib/db/mongo${isTS ? '' : '.js'}';`);
            imports.push(`import { mongoUserRepository } from '../models/mongo.user.repository${isTS ? '' : '.js'}';`);
            imports.push(`import * as UserService from '../modules/user/user.service${isTS ? '' : '.js'}';`);

            setupLines.push("await connectMongo();");
            setupLines.push("UserService.setUserRepository(mongoUserRepository);");

            if (auth === 'apikey') {
                imports.push(`import { mongoApiKeyRepository } from '../models/mongo.apikey.repository${isTS ? '' : '.js'}';`);
                // Assuming separate auth setup or specific injection if needed
                // For now, ApiKey middleware might import repo directly or we inject it?
                // Current plan: Auth middleware is just middleware. 
                // If ApiKeyMiddleware needs repo, ideally we inject it.
                // But for simplicity in functional scope, we might import it in the middleware 
                // OR we set it globally like UserService. 
                // Let's assume ApiKeyMiddleware imports the repo directly or we set it in a shared config.
                // Actually, if we want properly decoupled, we should have `setApiKeyRepository` in middleware file?
            }
        } else if (db === 'postgresql') {
            imports.push(`import { connectPostgres } from '../lib/db/postgres${isTS ? '' : '.js'}';`);
            imports.push(`import { postgresUserRepository } from '../models/postgres.user.repository${isTS ? '' : '.js'}';`);
            imports.push(`import * as UserService from '../modules/user/user.service${isTS ? '' : '.js'}';`);

            setupLines.push("await connectPostgres();");
            setupLines.push("UserService.setUserRepository(postgresUserRepository);");
        }

        // Auth Setup - mostly middleware file replacement handled by preset copy
        // But if we need to configure global strategies, do it here.
        // For now, the middleware file itself carries the logic.

        let content = imports.join('\n') + '\n\n';

        if (isTS) {
            content += 'export const setup = async (): Promise<void> => {\n';
        } else {
            content += 'export const setup = async () => {\n';
        }

        content += `    ${setupLines.join('\n    ')}\n`;
        content += '};\n';

        const ext = isTS ? 'ts' : 'js';
        const setupPath = path.join(this.projectPath, 'src', 'config', `setup.${ext}`);
        fs.writeFileSync(setupPath, content.trim());
    }

    generateEnvExample() {
        const db = this.options.database;
        const auth = this.options.auth;

        let envKeys = [
            'PORT=3000',
            'NODE_ENV=development'
        ];

        if (db === 'mongodb' || db === 'postgresql') {
            envKeys.push('DB_URI=');
        }

        if (auth === 'jwt') {
            envKeys.push('JWT_SECRET=');
        }

        const content = envKeys.join('\n');
        fs.writeFileSync(path.join(this.projectPath, '.env.example'), content);
    }

    // convertToJavascript removed

}
