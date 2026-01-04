#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { input, select, confirm } from "@inquirer/prompts";
import ora from "ora";
import { Assembler } from "./Assembler.js";

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read package.json for version
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));

// ANSI color codes
const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    white: "\x1b[37m",
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

// Elegant Unicode icons
const icons = {
    check: "✔", // Clean check
    cross: "✖", // Clean cross
    dot: "•",   // Minimal dot
    arrow: "→",
    line: "│",
    corner: "└"
};

const banner = `
  ${c("bold", "Express Template")}  ${c("dim", pkg.version)}
`;

const LANGUAGE_CHOICES = [
    { name: "TypeScript (Recommended)", value: "typescript", description: "Type-safe, modern development" },
    { name: "JavaScript", value: "javascript", description: "Standard JavaScript (ES Modules)" }
];

const DB_CHOICES = [
    { name: "MongoDB", value: "mongodb", description: "NoSQL database with Mongoose" },
    { name: "PostgreSQL", value: "postgresql", description: "Relational database with pg" },
    { name: "None", value: null, description: "No database (or manual setup)" }
];

const AUTH_CHOICES = [
    { name: "JWT", value: "jwt", description: "JSON Web Tokens (Stateless)" },
    { name: "API Key", value: "apikey", description: "Simple API Key Header" },
    { name: "None", value: "none", description: "No authentication" }
];

const PM_CHOICES = [
    { name: "npm", value: "npm" },
    { name: "yarn", value: "yarn" },
    { name: "pnpm", value: "pnpm" },
    { name: "bun", value: "bun" }
];

async function main() {
    console.log(banner);

    // Initial Args Check
    const args = process.argv.slice(2);


    if (args.includes("--version") || args.includes("-v")) {
        console.log(`v${pkg.version}`);
        process.exit(0);
    }

    if (args.includes("--help") || args.includes("-h")) {
        console.log(c("bold", "Usage:") + "  npx express-api-template [options]");
        console.log("");
        console.log(c("bold", "Options:"));
        console.log("  -h, --help       " + c("dim", "Show this help message"));
        console.log("  -v, --version    " + c("dim", "Show version number"));
        console.log("");
        console.log(c("bold", "Features:"));
        console.log("  " + c("cyan", "Modular Architecture") + "  Scalable folder structure separating config, modules, and shared logic.");
        console.log("  " + c("cyan", "Database Agnostic") + "     Native support for MongoDB (Mongoose) and PostgreSQL (pg).");
        console.log("  " + c("cyan", "Auth Ready") + "            Built-in JWT or API Key strategies supported out-of-the-box.");
        console.log("  " + c("cyan", "Type-Safe") + "             First-class TypeScript support with Zod validation.");
        console.log("");
        console.log(c("bold", "Presets:"));
        console.log("  " + c("yellow", "Database") + ":  MongoDB, PostgreSQL, None");
        console.log("  " + c("yellow", "Auth") + ":      JWT, API Key, None");
        console.log("");
        console.log(c("bold", "Examples:"));
        console.log("  " + c("dim", "$") + " npx express-api-template");
        console.log("  " + c("dim", "$") + " npx express-api-template --help");
        console.log("");
        process.exit(0);
    }

    try {
        const projectName = await input({
            message: "Project name:",
            default: "express-starter",
            validate: (value) => {
                if (!value.trim()) return "Name cannot be empty";
                if (fs.existsSync(path.join(CURR_DIR, value))) return "Folder already exists";
                return true;
            }
        });

        const language = await select({
            message: "Select Language:",
            choices: LANGUAGE_CHOICES
        });

        const database = await select({
            message: "Select Database:",
            choices: DB_CHOICES
        });

        const auth = await select({
            message: "Select Authentication:",
            choices: AUTH_CHOICES
        });

        // Language is currently locked to TS as per new architecture (Js coming soon via compilation)
        // But for DX let's just assume TS for now or add a dummy prompt if we want to support JS compile later.

        const install = await confirm({
            message: "Install dependencies?",
            default: true
        });

        let packageManager = 'npm';
        if (install) {
            packageManager = await select({
                message: "Select Package Manager:",
                choices: PM_CHOICES,
                default: 'npm'
            });
        }


        // Elegant Summary
        console.log("");
        console.log(c("dim", "  TARGET"));
        console.log(`  ${c("white", projectName)}`);
        console.log("");

        console.log(c("dim", "  STACK"));
        console.log(`  Language    ${c("bold", language === 'typescript' ? 'TypeScript' : 'JavaScript')}`);
        console.log(`  Database    ${c("bold", database ? DB_CHOICES.find(d => d.value === database).name : 'None')}`);
        console.log(`  Auth        ${c("bold", AUTH_CHOICES.find(a => a.value === auth).name)}`);
        if (install) {
            console.log(`  Manager     ${c("bold", packageManager)}`);
        }
        console.log("");

        const confirmSetup = await confirm({
            message: "Create project?",
            default: true
        });

        if (!confirmSetup) {
            console.log(c("dim", "\n  Cancelled.\n"));
            process.exit(0);
        }

        // Execution
        const projectPath = path.join(CURR_DIR, projectName);
        console.log(""); // Whitespace

        const spinner = ora({
            text: c("dim", "Assembling..."),
            color: 'gray',
            spinner: 'dots'
        }).start();

        try {
            const assembler = new Assembler(projectPath, {
                language,
                database,
                auth,
                structure: 'Scalable',
                onStateChange: (state) => {
                    spinner.text = c("dim", state);
                }
            });

            await assembler.assemble();
            spinner.succeed("Project structure created!");
        } catch (err) {
            spinner.fail("Failed to create project");
            console.error(err);
            process.exit(1);
        }

        if (install) {
            console.log(c("dim", `\nInstalling dependencies with ${packageManager}...`));
            await new Promise((resolve, reject) => {
                const child = spawn(packageManager, ["install"], {
                    cwd: projectPath,
                    stdio: "inherit",
                    shell: process.platform === 'win32'
                });

                child.on("error", reject);
                child.on("close", (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Installation failed with code ${code}`));
                    }
                });
            });
            console.log(c("green", `\n${icons.check} Dependencies installed!`));
        }

        console.log("");
        console.log(`${c("green", icons.check)} ${c("bold", "Done! Get started:")}`);
        console.log("");
        console.log(`  cd ${projectName}`);
        console.log(`  1. cd ${projectName}`);
        console.log(`  2. cp .env.example .env`);
        if (!install) console.log(`  2. ${packageManager} install`);

        let step = install ? 2 : 3;

        // Add specific reminders based on choices
        if (database === 'mongodb') {
            console.log(`  ${step}. Update .env with your MongoDB URI`);
            step++;
        }
        if (database === 'postgresql') {
            console.log(`  ${step}. Update .env with your PostgreSQL Connection String`);
            step++;
        }
        if (auth === 'jwt' || auth === 'apikey') {
            console.log(`  ${step}. Update .env with auth secrets`);
            step++;
        }

        const runCmd = packageManager === 'npm' ? 'npm run dev' : `${packageManager} dev`;
        console.log(`  ${step}. ${runCmd}`);
        console.log("");

    } catch (error) {
        if (error.name === "ExitPromptError") {
            console.log("\nGoodbye!");
            process.exit(0);
        }
        console.error(error);
        process.exit(1);
    }
}

main();
