#!/usr/bin/env node

import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createDirectoryContents from "./createDirectoryContents.js";
import { spawn } from "node:child_process";
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

async function runCLI() {
	try {
		let projectName = process.argv[2];

		const { shouldProceed } = await inquirer.prompt([
			{
				type: "confirm",
				name: "shouldProceed",
				message: "Do you want to proceed with the project creation? (default: yes)",
				default: true,
			},
		]);
		if (!shouldProceed) {
			console.log(chalk.yellow("Project creation cancelled!"));
			return;
		}

		if (!projectName) {
			const { projectNameInput } = await inquirer.prompt([
				{
					type: "input",
					name: "projectNameInput",
					message: "Enter the project name:",
					validate: (input) => {
						if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
						return "Project name may only include letters, numbers, underscores and hashes.";
					},
				},
			]);
			projectName = projectNameInput;
		}

		const { template } = await inquirer.prompt([
			{
				type: "list",
				name: "template",
				message: "Choose a template:",
				choices: CHOICES,
			},
		]);

		// install dependencies
		const { installDependencies } = await inquirer.prompt([
			{
				type: "confirm",
				name: "installDependencies",
				message: "Do you want to install dependencies? (default: yes)",
				default: true,
			},
		]);

		// if true select package manager
		let packageManager;
		if (installDependencies) {
			const { pm } = await inquirer.prompt([
				{
					type: "list",
					name: "pm",
					message: "Choose a package manager:",
					choices: ["npm", "yarn", "pnpm", "bun"],
				},
			]);
			packageManager = installDependencies ? pm : "npm";
		}

		const { initialize_git } = await inquirer.prompt([
			{
				type: "confirm",
				name: "initialize_git",
				message: "Initialize git repository? (default: yes)",
				default: true,
			},
		]);

		// show spinner
		const spinner = ora("Creating project").start();

		// create project
		if (!fs.existsSync(projectName)) {
			await fs.promises.mkdir(projectName);
		} else {
			console.error(chalk.red(`Error: Project directory "${projectName}" already exists.`));
			process.exit(1);
		}

		const projectPath = path.join(process.cwd(), projectName);
		console.log(chalk.blue(`Creating project in ${projectPath}`));
		if (!fs.existsSync(projectPath)) {
			console.error(chalk.red(`Error: Project directory "${projectName}" does not exist.`));
			process.exit(1);
		}

		createDirectoryContents(path.join(__dirname, "templates", template), projectName);

		// package.json name
		const packageJsonPath = path.join(projectPath, "package.json");
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8").replace(/"name": ".*"/, `"name": "${projectName}"`));
		fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

		spinner.succeed("Project files created");

		if (installDependencies) {
			const resolvedProjectDir = path.resolve(projectPath);
			process.chdir(resolvedProjectDir);

			const installCommand = `${packageManager} install`;
			if (!installCommand) {
				console.error(chalk.red(`Unsupported package manager: ${packageManager}`));
				process.exit(1);
			}

			try {
				spinner.start(`Installing dependencies using ${packageManager}`);

				const { dependencies, devDependencies } = JSON.parse(fs.readFileSync(`${__dirname}/templates/${template}/package.json`, "utf-8"));
				const dependenciesList = Object.keys(dependencies).join(" ");
				const devDependenciesList = Object.keys(devDependencies).join(" ");
				const installDependenciesCommand = `${packageManager} install ${dependenciesList}`;
				const installDevDependenciesCommand = `${packageManager} install ${devDependenciesList} --save-dev`;

				const runCommand = async (command) => {
					const child = spawn(command, { shell: true, cwd: resolvedProjectDir, stdio: "pipe" });

					const stdoutChunks = [];
					const stderrChunks = [];

					child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
					child.stderr.on("data", (chunk) => stderrChunks.push(chunk));

					const done = new Promise((resolve) =>
						child.on("close", (code) => {
							if (code === 0) {
								resolve();
							} else {
								const error = new Error(`Failed to run command: ${command}`);
								error.code = code;
								error.stdout = Buffer.concat(stdoutChunks).toString();
								error.stderr = Buffer.concat(stderrChunks).toString();
								resolve(Promise.reject(error));
							}
						}),
					);
					await done;

					const stdout = Buffer.concat(stdoutChunks).toString();
					const stderr = Buffer.concat(stderrChunks).toString();

					if (stdout) {
						console.log(chalk.dim(stdout));
					}

					if (stderr) {
						console.log(chalk.yellow("Warnings during installation:"), chalk.dim(stderr));
					}
				};

				await runCommand(installDependenciesCommand);
				await runCommand(installDevDependenciesCommand);

				spinner.succeed(chalk.green("Dependencies installed"));
			} catch (error) {
				console.error(chalk.red("Error:"), error);
				spinner.fail(chalk.red(`Failed to install dependencies using ${packageManager}`));

				if (error.stderr) {
					console.error(chalk.red("Error details:"), chalk.dim(error.stderr));
				}

				if (error.stdout) {
					console.error(chalk.dim(error.stdout));
				}

				if (error.code === "ENOENT") {
					console.error(chalk.red(`Error: Package manager ${packageManager} not installed in your system!`));
					console.error(chalk.yellow(`Please install ${packageManager} and try again.`));
				}
			}
		}

		if (initialize_git) {
			const { stdout, stderr } = await execPromise("git init", { cwd: projectDir });
			if (stderr) console.error(chalk.yellow("Warnings:"), stderr);
			if (stdout) console.log(chalk.dim(stdout));
			console.log(chalk.green("Git repository initialized"));
		}

		console.log("\n", chalk.green("✨ Project created successfully ✨"));
		console.log(chalk.blue(`1. cd ${projectName}`));
		console.log(chalk.blue("2. change .env variables and spin the project\n"));
		console.log(chalk.blue("Happy coding! 🚀"));
	} catch (error) {
		console.error(chalk.red("Error:"), error);
		process.exit(1);
	}
}

runCLI();
