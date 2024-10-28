#!/usr/bin/env node

import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createDirectoryContents from "./createDirectoryContents.js";
import { spawn } from "node:child_process";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const AVAILABLE_TEMPLATES = fs.readdirSync(`${CURRENT_DIR}/templates`).sort();
const PACKAGE_MANAGERS = ["npm", "yarn", "pnpm", "bun"];

const executeCommand = async (command, workingDirectory) => {
	return new Promise((resolve, reject) => {
		const childProcess = spawn(command, {
			shell: true,
			cwd: workingDirectory,
			stdio: ["ignore", "pipe", "pipe"],
		});

		let commandOutput = "";
		let commandErrors = "";

		childProcess.stdout?.on("data", (data) => {
			commandOutput += data;
		});
		childProcess.stderr?.on("data", (data) => {
			commandErrors += data;
		});

		childProcess.on("close", (exitCode) => {
			if (exitCode === 0) {
				resolve({ commandOutput, commandErrors });
			} else {
				const error = new Error(`Command execution failed: ${command}`);
				error.code = exitCode;
				error.output = commandOutput;
				error.errors = commandErrors;
				reject(error);
			}
		});
	});
};

async function initializeProject() {
	try {
		console.log(chalk.cyan("\n🚀 Welcome to Project Scaffolding Tool 🚀\n"));

		let projectName = process.argv[2];

		const { confirmCreation } = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirmCreation",
				message: "Would you like to create a new project?",
				default: true,
			},
		]);

		if (!confirmCreation) {
			console.log(chalk.yellow("\n⚠️  Project creation cancelled. Have a great day!\n"));
			return;
		}

		if (!projectName) {
			const { projectNameInput } = await inquirer.prompt([
				{
					type: "input",
					name: "projectNameInput",
					message: "📝 Please enter your project name:",
					validate: (input) => {
						const isValid = /^([A-Za-z\-\\_\d])+$/.test(input);
						return isValid || "Project name can only contain letters, numbers, underscores, and hashes.";
					},
				},
			]);
			projectName = projectNameInput;
		}

		const { selectedTemplate } = await inquirer.prompt([
			{
				type: "list",
				name: "selectedTemplate",
				message: "🎯 Select a template for your project:",
				choices: AVAILABLE_TEMPLATES,
			},
		]);

		const { shouldInstallDeps } = await inquirer.prompt([
			{
				type: "confirm",
				name: "shouldInstallDeps",
				message: "📦 Would you like to install dependencies?",
				default: true,
			},
		]);

		let selectedPackageManager;
		if (shouldInstallDeps) {
			const { packageManager } = await inquirer.prompt([
				{
					type: "list",
					name: "packageManager",
					message: "🔧 Select your preferred package manager:",
					choices: PACKAGE_MANAGERS,
				},
			]);
			selectedPackageManager = packageManager;
		}

		const { initializeGit } = await inquirer.prompt([
			{
				type: "confirm",
				name: "initializeGit",
				message: "🔄 Initialize a Git repository?",
				default: true,
			},
		]);

		const progressSpinner = ora("🏗️  Creating your project...").start();

		// Project directory validation and creation
		const projectPath = path.join(process.cwd(), projectName);

		if (fs.existsSync(projectPath)) {
			progressSpinner.fail(chalk.red(`❌ Error: A directory named "${projectName}" already exists.`));
			process.exit(1);
		}

		await fs.promises.mkdir(projectName);

		if (!fs.existsSync(projectPath)) {
			progressSpinner.fail(chalk.red(`❌ Error: Failed to create directory "${projectName}".`));
			process.exit(1);
		}

		createDirectoryContents(path.join(CURRENT_DIR, "templates", selectedTemplate), projectName);

		// Update package configuration
		const packageJsonPath = path.join(projectPath, "package.json");
		const packageConfig = JSON.parse(
			fs.readFileSync(packageJsonPath, "utf-8").replace(/"name": ".*"/, `"name": "${projectName}"`),
		);
		fs.writeFileSync(packageJsonPath, JSON.stringify(packageConfig, null, 2));

		progressSpinner.succeed(chalk.green("✅ Project structure created successfully"));

		// Dependency installation
		if (shouldInstallDeps) {
			try {
				const resolvedProjectDir = path.resolve(projectPath);
				process.chdir(resolvedProjectDir);

				progressSpinner.start(`📦 Installing dependencies using ${selectedPackageManager}...`);

				const templatePackageJsonPath = `${CURRENT_DIR}/templates/${selectedTemplate}/package.json`;
				const { dependencies = {}, devDependencies = {} } = JSON.parse(
					fs.readFileSync(templatePackageJsonPath, "utf-8"),
				);

				const formatDependencyString = (deps) =>
					Object.keys(deps)
						.map((dep) => `"${dep}"`)
						.join(" ");

				// Parallel dependency installation
				const installationTasks = [
					dependencies &&
						Object.keys(dependencies).length &&
						executeCommand(
							`${selectedPackageManager} install ${formatDependencyString(dependencies)}`,
							resolvedProjectDir,
						),
					devDependencies &&
						Object.keys(devDependencies).length &&
						executeCommand(
							`${selectedPackageManager} install ${formatDependencyString(devDependencies)} --save-dev`,
							resolvedProjectDir,
						),
				].filter(Boolean);

				const results = await Promise.all(installationTasks);
				// Log installation warnings if any
				for (const { commandErrors } of results) {
					if (commandErrors) {
						console.log(chalk.yellow("\n⚠️  Installation warnings:"), chalk.dim(commandErrors));
					}
				}

				progressSpinner.succeed(chalk.green("✅ Dependencies installed successfully"));
			} catch (error) {
				progressSpinner.fail(chalk.red(`❌ Failed to install dependencies using ${selectedPackageManager}`));

				if (error.errors) {
					console.error(chalk.red("\n🔍 Error details:"), chalk.dim(error.errors));
				}

				if (error.code === "ENOENT") {
					console.error(chalk.red(`\n❌ ${selectedPackageManager} is not installed on your system`));
					console.error(chalk.yellow(`📝 Please install ${selectedPackageManager} and try again`));
				}

				throw error;
			}
		}

		// Git initialization
		if (initializeGit) {
			try {
				await executeCommand("git init", projectPath);
				console.log(chalk.green("\n✅ Git repository initialized successfully"));
			} catch (error) {
				console.log(chalk.red("\n❌ Failed to initialize Git repository"));
				throw error;
			}
		}

		console.log(chalk.green("\n\n🎉 Project created successfully! 🎉"));
		console.log(chalk.cyan("\nNext steps:"));
		console.log(chalk.white(`1. cd ${projectName}`));
		console.log(chalk.white("2. Configure your environment variables"));
		console.log(chalk.white("3. Start development\n"));
		console.log(chalk.cyan("Thank you for using our scaffolding tool! Happy coding! 🚀\n"));
	} catch (error) {
		console.error(chalk.red("\n❌ An error occurred:"), error);
		process.exit(1);
	}
}

initializeProject();
