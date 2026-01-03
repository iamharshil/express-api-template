#!/usr/bin/env node

import { exec } from "node:child_process";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { input, select, confirm } from "@inquirer/prompts";
import ora from "ora";
import createDirectoryContents from "./createDirectoryContents.js";

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

// Professional Unicode icons
const icons = {
    express: ">",
    check: "✓",
    cross: "✗",
    arrow: "→",
    dot: "●",
    star: "★",
    folder: "▸",
    file: "◆",
    typescript: "TS",
    javascript: "JS",
    package: "□",
    warning: "⚠",
};

// ASCII Art Banner
const banner = `
${c("bold", "Express API Template")} ${c("dim", `v${pkg.version}`)}
${c("cyan", "Production-ready Express.js API scaffolding")}
`;

const STRUCTURE_CHOICES = [
    {
        name: `${c("yellow", icons.folder)} MVC (Model-View-Controller)`,
        value: "MVC",
        description: "Traditional architecture — great for small to medium projects",
    },
    {
        name: `${c("magenta", icons.package)} Scalable (Modular)`,
        value: "Scalable",
        description: "Feature-based modules — ideal for large, maintainable codebases",
    },
];

const LANGUAGE_CHOICES = [
    {
        name: `${c("yellow", icons.javascript)} JavaScript`,
        value: false,
        description: "Classic JavaScript with ES modules",
    },
    {
        name: `${c("blue", icons.typescript)} TypeScript`,
        value: true,
        description: "Type-safe development with full TypeScript support",
    },
];

function printSuccess(projectName, projectLanguage, projectStructure, installed) {
    const lang = projectLanguage === "Typescript" ? "TypeScript" : "JavaScript";
    const langIcon = projectLanguage === "Typescript" ? c("blue", icons.typescript) : c("yellow", icons.javascript);
    const structIcon = projectStructure === "Scalable" ? c("magenta", icons.package) : c("yellow", icons.folder);

    console.log("");
    console.log(`${c("green", icons.check)} ${c("bold", "Project created successfully!")}`);
    console.log("");
    console.log(c("dim", "  Project:      ") + c("bold", projectName));
    console.log(c("dim", "  Language:     ") + `${langIcon} ${lang}`);
    console.log(c("dim", "  Structure:    ") + `${structIcon} ${projectStructure}`);
    console.log(c("dim", "  Dependencies: ") + (installed ? `${c("green", icons.check)} Installed` : `${c("yellow", icons.dot)} Pending`));
    console.log("");
    console.log(c("dim", "──────────────────────────────────────────────────"));
    console.log("");
    console.log(c("bold", "  Next steps:"));
    console.log("");
    console.log(`  ${c("cyan", "1.")} ${c("dim", "cd")} ${c("bold", projectName)}`);
    let step = 2;
    if (!installed) {
        console.log(`  ${c("cyan", `${step}.`)} ${c("dim", "npm install")}`);
        step++;
    }
    console.log(`  ${c("cyan", `${step}.`)} ${c("dim", "cp .env.example .env")}`);
    step++;
    console.log(`  ${c("cyan", `${step}.`)} ${c("dim", "npm run dev")}`);
    console.log("");
    console.log(c("dim", "──────────────────────────────────────────────────"));
    console.log("");
    console.log(`  ${c("yellow", icons.star)} ${c("dim", "Star us on GitHub:")} ${c("cyan", "https://github.com/iamharshil/express-api-template")}`);
    console.log("");
}

function printError(message) {
    console.log("");
    console.log(`${c("red", icons.cross)} ${c("bold", "Error: ")} ${message}`);
    console.log("");
}

async function main() {
    // Show banner
    console.log(banner);

    // Check for --help or --version flags
    const args = process.argv.slice(2);
    if (args.includes("--help") || args.includes("-h")) {
        console.log(c("bold", "Usage:") + " npx express-api-template [options]");
        console.log("");
        console.log(c("bold", "Options:"));
        console.log(`  -h, --help      Show this help message`);
        console.log(`  -v, --version   Show version number`);
        console.log("");
        console.log(c("bold", "Examples:"));
        console.log(`  ${c("dim", "$")} npx express-api-template`);
        console.log(`  ${c("dim", "$")} npx express-api-template --help`);
        console.log("");
        process.exit(0);
    }

    if (args.includes("--version") || args.includes("-v")) {
        console.log(`v${pkg.version}`);
        process.exit(0);
    }

    try {
        // Project name
        const projectName = await input({
            message: "Project name:",
            default: "my-express-api",
            validate: (value) => {
                if (!value.trim()) return "Project name cannot be empty.";
                if (!/^([A-Za-z\-_\d])+$/.test(value)) {
                    return "Only letters, numbers, underscores, and hyphens allowed.";
                }
                if (fs.existsSync(path.join(CURR_DIR, value))) {
                    return `Folder "${value}" already exists. Choose a different name.`;
                }
                return true;
            },
        });

        // Project structure
        const projectStructure = await select({
            message: "Project structure:",
            choices: STRUCTURE_CHOICES,
        });

        // Language choice
        const useTypeScript = await select({
            message: "Language:",
            choices: LANGUAGE_CHOICES,
        });

        // Install packages
        const shouldInstallPackages = await confirm({
            message: "Install dependencies now?",
            default: true,
        });

        // Build template path
        const projectLanguage = useTypeScript ? "Typescript" : "Javascript";
        const projectChoice = `${projectLanguage}-${projectStructure}`;
        const templatePath = path.join(__dirname, "templates", projectChoice);
        const projectPath = path.join(CURR_DIR, projectName);

        // Create project with spinner
        const createSpinner = ora({
            text: "Creating project structure...",
            spinner: "dots",
        }).start();

        await new Promise((resolve) => setTimeout(resolve, 500)); // Brief pause for effect
        fs.mkdirSync(projectPath);
        createDirectoryContents(templatePath, projectName);
        createSpinner.succeed("Project structure created");

        if (shouldInstallPackages) {
            const installSpinner = ora({
                text: "Installing dependencies...",
                spinner: "dots",
            }).start();

            await new Promise((resolve, reject) => {
                exec("npm install", { cwd: projectPath }, (error) => {
                    if (error) {
                        installSpinner.fail("Failed to install dependencies");
                        reject(error);
                        return;
                    }
                    installSpinner.succeed("Dependencies installed");
                    resolve();
                });
            });
        }

        printSuccess(projectName, projectLanguage, projectStructure, shouldInstallPackages);
    } catch (error) {
        if (error.name === "ExitPromptError") {
            console.log("");
            console.log(c("dim", "  Setup cancelled. See you next time!"));
            console.log("");
            process.exit(0);
        }
        printError(error.message || "An unexpected error occurred.");
        process.exit(1);
    }
}

main();
