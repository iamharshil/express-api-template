import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TS_BASE_PATH = path.join(__dirname, 'templates', 'ts');
const JS_BASE_PATH = path.join(__dirname, 'templates', 'js');

// Ensure JS dir exists
if (!fs.existsSync(JS_BASE_PATH)) {
    fs.mkdirSync(JS_BASE_PATH, { recursive: true });
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function transpileFile(filePath) {
    const source = fs.readFileSync(filePath, 'utf-8');
    const result = ts.transpileModule(source, {
        compilerOptions: {
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            esModuleInterop: true,
            strict: true,
            skipLibCheck: true, // We don't check types during simple file-to-file transpile
            types: [] // no global types
        }
    });

    // Quick fix for ESM directory imports if needed, 
    // but typically we are just transpiling 1-to-1.
    // However, we need to ensure local imports have .js extensions or rely on node resolution.
    // Since we are moving to pre-transpiled, let's assume standard node ESM behavior.

    // We might need to rewrite imports from .ts to .js?
    // ts.transpileModule doesn't automatically do that.
    // For now let's just write the JS output.

    // Check for "app" import issue from migration
    let jsContent = result.outputText;

    // Hacky fix for require.main if present (not expected with new code, but good safety)
    if (jsContent.includes('require.main === module')) {
        jsContent = jsContent.replace('require.main === module', 'process.argv[1] === fileURLToPath(import.meta.url)');
    }

    return jsContent;
}

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
            console.log(`Transpiling: ${entry.name}`);
            const jsContent = transpileFile(fullPath);
            const jsPath = fullPath.replace(/\.ts$/, '.js');
            fs.writeFileSync(jsPath, jsContent);
            fs.unlinkSync(fullPath); // Remove .ts file
        }
    }
}

function cleanPackageJson(dir) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        // Remove TS deps
        const devDepsToRemove = ['typescript', 'ts-node', '@types/node', '@types/express', '@types/cors', '@types/pg'];
        if (pkg.devDependencies) {
            for (const dep of devDepsToRemove) {
                delete pkg.devDependencies[dep];
            }
            // Remove any other @types
            Object.keys(pkg.devDependencies).forEach(key => {
                if (key.startsWith('@types/')) delete pkg.devDependencies[key];
            });
        }

        // Update scripts
        if (pkg.scripts) {
            pkg.scripts.start = 'node src/server.js';
            pkg.scripts.dev = 'node --watch --env-file=.env src/server.js'; // Node 18+ watch? Or use nodemon?
            // Let's stick to nodemon for now as template has it
            pkg.scripts.dev = 'nodemon src/server.js';
            delete pkg.scripts.build;
            delete pkg.scripts.lint;
        }

        pkg.main = 'src/server.js';

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    // Remove tsconfig
    const tsconfigPath = path.join(dir, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) fs.unlinkSync(tsconfigPath);
}

async function main() {
    console.log('Building JavaScript Templates...');

    // 1. Copy Base
    console.log('Processing Base...');
    const destBase = path.join(JS_BASE_PATH, 'base');
    // Clean dest first
    if (fs.existsSync(destBase)) fs.rmSync(destBase, { recursive: true, force: true });

    copyDir(path.join(TS_BASE_PATH, 'base'), destBase);
    processDirectory(destBase);
    cleanPackageJson(destBase);

    // 2. Copy Presets
    console.log('Processing Presets...');
    // We iterate through presets
    const tsPresetsPath = path.join(TS_BASE_PATH, 'presets');
    const jsPresetsPath = path.join(JS_BASE_PATH, 'presets');

    const presets = fs.readdirSync(tsPresetsPath, { withFileTypes: true });
    for (const preset of presets) {
        if (preset.isDirectory()) {
            const destPreset = path.join(jsPresetsPath, preset.name);
            if (fs.existsSync(destPreset)) fs.rmSync(destPreset, { recursive: true, force: true });

            copyDir(path.join(tsPresetsPath, preset.name), destPreset);
            processDirectory(destPreset);
            // Presets often don't have package.json, just files
        }
    }

    console.log('Done Building JS Templates!');
}

main().catch(console.error);
