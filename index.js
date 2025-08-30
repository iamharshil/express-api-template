#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import ora from "ora";
import createDirectoryContents from "./createDirectoryContents.js";
const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const STRUCTURE_CHOICES = {
    "MVC (Model-View-Controller)": "MVC",
    "Scalable (Modular)": "Scalable",
};

const QUESTIONS = [
    {
        name: "project-name",
        type: "input",
        message: "What should your project folder be called?",
        default: "my-express-api",
        validate: function (input) {
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            return "Project name can only include letters, numbers, underscores, and hyphens.";
        },
    },
    {
        name: "project-choice",
        type: "list",
        message: "Choose a project structure:",
        choices: Object.keys(STRUCTURE_CHOICES),
    },
    {
        name: "language-choice",
        type: "confirm",
        message: "Would you like to use TypeScript?",
        default: false,
    },
    {
        name: "install-packages",
        type: "confirm",
        message: "Install npm dependencies after setup?",
        default: true,
    },
];

console.log("\n\x1b[36m%s\x1b[0m", "Welcome to Express API Template CLI 🚀\n");
inquirer.prompt(QUESTIONS).then((answers) => {
    const projectName = answers["project-name"];
    const projectLanguage = answers["language-choice"] ? "Typescript" : "Javascript";
    const projectChoice = `${projectLanguage}-${STRUCTURE_CHOICES[answers["project-choice"]]}`;
    const templatePath = `${__dirname}/templates/${projectChoice}`;
    const shouldInstallPackages = answers["install-packages"];

    if (fs.existsSync(`${CURR_DIR}/${projectName}`)) {
        console.log("\x1b[31m%s\x1b[0m", `Error: Folder '${projectName}' already exists. Choose a different name.\n`);
        return process.exit(1);
    }
    fs.mkdirSync(`${CURR_DIR}/${projectName}`);
    createDirectoryContents(templatePath, projectName);

    if (shouldInstallPackages) {
        const spinner = ora("Installing packages...").start();
        exec("npm install", { cwd: `${CURR_DIR}/${projectName}` }, (error, stdout, stderr) => {
            spinner.stop();
            if (error) {
                console.error(`Error installing dependencies: ${error.message}`);
                return;
            }
            console.log("\n\x1b[36m%s\x1b[0m", "🚀 Your Express API project is ready!");
            console.log("\x1b[32m%s\x1b[0m", `👉 cd ${projectName}`);
            console.log("\x1b[32m%s\x1b[0m", "👉 npm run dev");
            console.log("\x1b[33m%s\x1b[0m", "✨ Happy coding!\n");
        });
    } else {
        console.log("\n\x1b[36m%s\x1b[0m", "\n🎉 Your Express API project is ready!");
        console.log("\x1b[32m%s\x1b[0m", `👉 cd ${projectName}`);
        console.log("\x1b[32m%s\x1b[0m", "👉 npm run dev");
        console.log("\x1b[33m%s\x1b[0m", "✨ Happy coding!\n");
    }
});
