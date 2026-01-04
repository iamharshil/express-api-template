import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Assembler } from '../Assembler';

const TEST_DIR = path.join(process.cwd(), 'test', 'matrix-test-output');

// Helper to clear test dir
function clearTestDir() {
    if (fs.existsSync(TEST_DIR)) {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
}

describe('Template Matrix Tests', () => {
    beforeEach(() => {
        clearTestDir();
        fs.mkdirSync(TEST_DIR, { recursive: true });
    });

    afterEach(() => {
        clearTestDir();
    });

    const languages = ['typescript', 'javascript'];
    const databases = ['mongodb', 'postgresql', null];
    const auths = ['jwt', 'apikey', 'none'];

    const combinations = [];
    languages.forEach(lang => {
        databases.forEach(db => {
            auths.forEach(auth => {
                combinations.push({ language: lang, database: db, auth: auth });
            });
        });
    });

    it.each(combinations)('should generate %s project with DB=%s and Auth=%s', async ({ language, database, auth }) => {
        const projectName = `proj-${language}-${database}-${auth}`;
        const projectPath = path.join(TEST_DIR, projectName);

        // Mock state change to avoid console noise
        const onStateChange = () => { };

        const assembler = new Assembler(projectPath, {
            language,
            database,
            auth,
            // structure: 'Scalable', // Default in Assembler if implied
            onStateChange
        });

        await assembler.assemble();

        // 1. Verify Entry Point
        const ext = language === 'typescript' ? 'ts' : 'js';
        expect(fs.existsSync(path.join(projectPath, `src/server.${ext}`))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, `src/app.${ext}`))).toBe(true);

        // 2. Verify Config
        expect(fs.existsSync(path.join(projectPath, `.env.example`))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, `src/config/setup.${ext}`))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, `src/config/bootstrap.${ext}`))).toBe(false); // Old file should be gone
        expect(fs.existsSync(path.join(projectPath, `package.json`))).toBe(true);

        // 3. Verify Content Logic (Basic)
        const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));

        if (language === 'javascript') {
            expect(pkg.devDependencies['typescript']).toBeUndefined();
            expect(pkg.scripts.start).toContain('node src/server.js');
        } else {
            expect(pkg.devDependencies['typescript']).toBeDefined();
        }

        if (database === 'mongodb') {
            expect(JSON.stringify(pkg.dependencies)).toContain('mongoose');
        }
        if (database === 'postgresql') {
            expect(JSON.stringify(pkg.dependencies)).toContain('pg');
        }

        // 4. Verify Setup Imports (Functional)
        const setupContent = fs.readFileSync(path.join(projectPath, `src/config/setup.${ext}`), 'utf-8');
        if (database === 'mongodb') {
            expect(setupContent).toContain('mongoUserRepository');
            expect(setupContent).toContain('connectMongo');
        } else if (database === 'postgresql') {
            expect(setupContent).toContain('postgresUserRepository');
            expect(setupContent).toContain('connectPostgres');
        }
    });
});
