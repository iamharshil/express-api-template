import { Assembler } from './Assembler.js';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectPath = path.join(__dirname, 'test', 'debug-project');

if (fs.existsSync(projectPath)) fs.rmSync(projectPath, { recursive: true, force: true });

async function run() {
    const assembler = new Assembler(projectPath, {
        language: 'typescript',
        database: 'postgresql',
        auth: 'jwt',
        onStateChange: console.log
    });

    await assembler.assemble();
    console.log('Assembled.');

    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    console.log('Installed.');

    try {
        execSync('npx tsc --noEmit', { cwd: projectPath, stdio: 'inherit' });
        console.log('Compiled Successfully.');
    } catch (e) {
        console.error('Compilation Failed.');
    }
}

run();
