import { describe, it, expect, beforeEach, afterEach, version } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { Assembler } from '../Assembler';

const TEST_DIR = path.join(process.cwd(), 'test', 'smoke-test-output');
const TIMEOUT = 120000; // 2 minutes for install + build

// Helper to clear test dir
function clearTestDir() {
    if (fs.existsSync(TEST_DIR)) {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
}

describe('Smoke Tests (Full Build)', () => {
    beforeEach(() => {
        clearTestDir();
        fs.mkdirSync(TEST_DIR, { recursive: true });
    });

    afterEach(() => {
        // Optional: Keep artifacts if failed? For now clean up.
        clearTestDir();
    });

    it('should compile a complex TypeScript project', async () => {
        const projectName = 'smoke-ts-postgres-jwt';
        const projectPath = path.join(TEST_DIR, projectName);
        const onStateChange = (msg) => console.log(`[Smoke] ${msg}`);

        // 1. Assemble
        const assembler = new Assembler(projectPath, {
            language: 'typescript',
            database: 'postgresql',
            auth: 'jwt',
            onStateChange
        });
        await assembler.assemble();

        // 2. Install Dependencies
        console.log('[Smoke] Installing dependencies...');
        // Use --no-audit --no-fund to speed up
        execSync('npm install --no-audit --no-fund', {
            cwd: projectPath,
            stdio: 'inherit'
        });

        // 3. Compile
        console.log('[Smoke] Compiling...');
        try {
            execSync('npx tsc --noEmit', {
                cwd: projectPath,
                stdio: 'inherit'
            });
            // If we get here, it passed
            expect(true).toBe(true);
        } catch (error) {
            console.error('Compilation failed');
            throw error;
        }

    });

    it('should install and verify a JavaScript project', async () => {
        const projectName = 'smoke-js-mongo-apikey';
        const projectPath = path.join(TEST_DIR, projectName);
        const onStateChange = (msg: string) => console.log(`[Smoke-JS] ${msg}`);

        // 1. Assemble
        const assembler = new Assembler(projectPath, {
            language: 'javascript',
            database: 'mongodb',
            auth: 'apikey',
            onStateChange
        });
        await assembler.assemble();

        // 2. Install Dependencies
        console.log('[Smoke-JS] Installing dependencies...');
        execSync('npm install --no-audit --no-fund', {
            cwd: projectPath,
            stdio: 'inherit'
        });

        // 3. Verify Syntax (node --check)
        // This validates the entry point and imports without starting the server
        console.log('[Smoke-JS] Verifying syntax...');
        try {
            // node --check is available in recent node versions
            execSync('node --check src/server.js', {
                cwd: projectPath,
                stdio: 'inherit'
            });
            expect(true).toBe(true);
        } catch (error) {
            console.error('JS Syntax check failed');
            throw error;
        }
    }, TIMEOUT);
});
