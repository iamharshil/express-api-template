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
/*

1. project name from args
2. proceed?
3. if no project-name, project-name?
4. template?
5. install dependencies?
  - if yes, package manager?
6. create project directory
7. create project files
8. change package.json name
9. install dependencies
10. success message


*/

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

		// show spinner
		const spinner = ora("Creating project").start();

		// create project
		if (!fs.existsSync(projectName)) {
			fs.mkdirSync(projectName);
		} else {
			console.error(chalk.red(`Error: Project directory "${projectName}" already exists.`));
			process.exit(1);
		}

		const projectPath = path.join(__dirname, projectName);
		if (!fs.existsSync(projectPath)) {
			console.error(chalk.red(`Error: Project directory "${projectName}" does not exist.`));
			process.exit(1);
		}

		createDirectoryContents(path.join(__dirname, "templates", template), projectName);

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
				// const child = spawn(installCommand, { shell: true, cwd: resolvedProjectDir, stdio: "pipe" });

				// const stdoutChunks = [];
				// const stderrChunks = [];

				// child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
				// child.stderr.on("data", (chunk) => stderrChunks.push(chunk));

				// const done = new Promise((resolve) =>
				// 	child.on("close", (code) => {
				// 		if (code === 0) {
				// 			resolve();
				// 		} else {
				// 			const error = new Error(`Failed to install dependencies using ${packageManager}`);
				// 			error.code = code;
				// 			error.stdout = Buffer.concat(stdoutChunks).toString();
				// 			error.stderr = Buffer.concat(stderrChunks).toString();
				// 			resolve(Promise.reject(error));
				// 		}
				// 	}),
				// );
				// await done;

				// const stdout = Buffer.concat(stdoutChunks).toString();
				// const stderr = Buffer.concat(stderrChunks).toString();

				// if (stdout) {
				// 	console.log(chalk.dim(stdout));
				// }

				// if (stderr) {
				// 	console.log(chalk.yellow("Warnings during installation:"), chalk.dim(stderr));
				// }

				// read package.json from resolvedProjectDir and get the dependencies and devDependencies and install them using packageManager install to cwd: resolvedProjectDir using spawn
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

			// const execPromise = promisify(exec);
			// try {
			// 	const { stderr } = await execPromise(installCommand, { cwd: projectDir });
			// 	spinner.succeed("Dependencies installed");
			// 	if (stderr) console.error(chalk.yellow("Warnings:"), stderr);
			// } catch (error) {
			// 	spinner.fail("Failed to install dependencies");
			// 	console.error(chalk.red("Error:"), error);
			// 	process.exit(1);
			// }
		}
		console.log("\n", chalk.green("✨ Project created successfully ✨"));
		// console cd to project
		console.log(chalk.blue(`cd ${projectName}`));
		console.log(chalk.blue("Change .env variables"));
		console.log(chalk.blue("Happy coding!"));
		console.log(chalk.blue(`🚀 ${__dirname}`));
	} catch (error) {
		console.error(chalk.red("Error:"), error);
		process.exit(1);
	}
}

runCLI();
