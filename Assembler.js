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

        // 6. Handle Language (Compile to JS if needed)
        if (this.options.language === 'javascript') {
            this.convertToJavascript();
        }
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

        // NOTE: In JS mode, we rely on standard imports. 
        // If we strictly used ESM in base, we might need extensions.
        // Assuming base template uses appropriate module resolution.

        let imports = [
            isTS ? "import { Application } from 'express';" : "import express from 'express';",
            "import modules from '../modules/index" + (isTS ? "" : ".js") + "';", // Adding extension for JS ESM if needed? 
            // Actually, generated code should probably just match what worked in my transpilation test.
            // Transpilation didn't add extensions automatically. 
            // If user runs with node, they need extensions or experimental flag.
            // But let's assume standard import for now.
            "import modules from '../modules';",
        ];

        let initLines = [
            "console.log('Bootstrapping...');"
        ];

        // DB Setup
        if (db === 'mongodb') {
            imports.push(`import { connectMongo } from '../infra/db/mongo${isTS ? '' : '.js'}';`);
            imports.push(`import { MongoUserRepository } from '../infra/repositories/MongoUserRepository${isTS ? '' : '.js'}';`);
            imports.push(`import { MongoApiKeyRepository } from '../infra/repositories/MongoApiKeyRepository${isTS ? '' : '.js'}';`);
            imports.push(`import { UserService } from '../modules/user/user.service${isTS ? '' : '.js'}';`); // Service usually default export?

            initLines.push("await connectMongo();");
            initLines.push("const userRepo = new MongoUserRepository();");
            initLines.push("const apiKeyRepo = new MongoApiKeyRepository();");
            initLines.push("UserService.setRepository(userRepo);");
        } else if (db === 'postgresql') {
            imports.push(`import { connectPostgres } from '../infra/db/postgres${isTS ? '' : '.js'}';`);
            imports.push(`import { PostgresUserRepository } from '../infra/repositories/PostgresUserRepository${isTS ? '' : '.js'}';`);
            imports.push(`import { PostgresApiKeyRepository } from '../infra/repositories/PostgresApiKeyRepository${isTS ? '' : '.js'}';`);
            imports.push(`import { UserService } from '../modules/user/user.service${isTS ? '' : '.js'}';`);

            initLines.push("await connectPostgres();");
            initLines.push("const userRepo = new PostgresUserRepository();");
            initLines.push("const apiKeyRepo = new PostgresApiKeyRepository();");
            initLines.push("UserService.setRepository(userRepo);");
        }

        // Auth Setup
        if (auth === 'jwt') {
            imports.push(`import { JwtAuthProvider } from '../infra/auth/JwtAuthProvider${isTS ? '' : '.js'}';`);
            initLines.push("const authProvider = new JwtAuthProvider();");
        } else if (auth === 'apikey') {
            imports.push(`import { ApiKeyAuthProvider } from '../infra/auth/ApiKeyAuthProvider${isTS ? '' : '.js'}';`);
            // ApiKeyAuth needs the repo, which we defined above as apiKeyRepo
            initLines.push("const authProvider = new ApiKeyAuthProvider(apiKeyRepo);");
        } else {
            imports.push(`import { NoAuthProvider } from '../infra/auth/NoAuthProvider${isTS ? '' : '.js'}';`);
            initLines.push("const authProvider = new NoAuthProvider();");
        }

        initLines.push("app.use('/api/v1', modules);");
        initLines.push("console.log('Bootstrap finished');");

        let content = imports.join('\n') + '\n\n';

        if (isTS) {
            content += 'export class Bootstrap {\n';
            content += '  public static async init(app: Application): Promise<void> {\n';
        } else {
            content += 'export class Bootstrap {\n';
            content += '  static async init(app) {\n';
        }

        content += `    ${initLines.join('\n    ')}\n`;
        content += '  }\n';
        content += '}\n';

        const ext = isTS ? 'ts' : 'js';
        const bootstrapPath = path.join(this.projectPath, 'src', 'config', `bootstrap.${ext}`);
        fs.writeFileSync(bootstrapPath, content.trim());
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

    convertToJavascript() {
        this.onStateChange('Converting to JavaScript (this may take a moment)...');

        // 1. Install dependencies temporarily to run tsc (we need typescript installed)
        // Since we are in the generated project, we might not have node_modules yet if verify/install wasn't run.
        // But tsc is needed. We can assume the environment has it or install it.
        // Better strategy: Use the template's own typescript config to compile.

        // We need to run `tsc` inside the projectPath.
        // But first we must ensure `typescript` is available. 
        // We'll rely on global tsc or fast install.

        try {
            // Install typescript locally just for the build step if not present
            // execSync('npm install typescript --no-save', { cwd: this.projectPath, stdio: 'ignore' });

            // Actually, since we are a CLI, we might want to just run the build using our own typescript dependency?
            // No, that's complex. 
            // EASIEST WAY: Run compilation after install?
            // User flow in index.js asks "Install dependencies?". 
            // If we compile NOW, we need dependencies. 
            // If we wait, we can't delete TS files yet.

            // ALTERNATIVE: Transpile using a lightweight tool included in CLI (like esbuild-wasm or typescript api) 
            // but we don't want to bloat.

            // Let's use `execSync` to run `tsc` assuming user has node. 
            // We'll force install typescript in the target temp directory if we have to.

            // For now, let's assume we can run `npx tsc`
            // Use stdio: ignore to keep spinner clean
            execSync('npm install typescript @types/node --no-save', { cwd: this.projectPath, stdio: 'ignore' });
            execSync('npx tsc', { cwd: this.projectPath, stdio: 'ignore' });

            // 2. Move dist/* to root or replace src logic
            // Default tsc output is `dist/` per our base tsconfig
            const distPath = path.join(this.projectPath, 'dist');
            const srcPath = path.join(this.projectPath, 'src');

            // Remove original src
            fs.rmSync(srcPath, { recursive: true, force: true });

            // Move dist contents to src (so structure remains src/...) OR keep it flat?
            // Usually JS projects still use src/.
            fs.renameSync(distPath, srcPath);

            // 3. Clean up package.json
            const pkgPath = path.join(this.projectPath, 'package.json');
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

            // Remove TS-related devDeps
            delete pkg.devDependencies['typescript'];
            delete pkg.devDependencies['ts-node'];
            delete pkg.devDependencies['@types/cors'];
            delete pkg.devDependencies['@types/express'];
            delete pkg.devDependencies['@types/node'];
            // Remove others added by presets (filtering by @types/)
            Object.keys(pkg.devDependencies).forEach(key => {
                if (key.startsWith('@types/')) delete pkg.devDependencies[key];
            });

            // Update scripts
            pkg.scripts.start = 'node src/config/app.js';
            pkg.scripts.dev = 'nodemon src/config/app.js';
            delete pkg.scripts.build; // No build step for JS
            delete pkg.scripts.lint;  // Might need js lint
            delete pkg.scripts.format; // Might need js format

            // Update main
            pkg.main = 'src/config/app.js';

            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

            // 4. Remove tsconfig
            fs.unlinkSync(path.join(this.projectPath, 'tsconfig.json'));

        } catch (error) {
            // Re-throw so CLI handles it
            throw new Error(`Failed to convert to JavaScript: ${error.message}`);
        }
    }
}
