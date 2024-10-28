import fs from "node:fs";
import path from "node:path";

const CURRENT_WORKING_DIR = process.cwd();
const GIT_IGNORE_FILE = ".gitignore";
const NPM_IGNORE_FILE = ".npmignore";
const ENCODING = "utf8";

const createDirectoryContents = (sourceTemplatePath, targetProjectPath) => {
	const sourceFiles = fs.readdirSync(sourceTemplatePath);

	for (const sourceFile of sourceFiles) {
		const sourceFilePath = path.join(sourceTemplatePath, sourceFile);
		const fileStats = fs.statSync(sourceFilePath);

		if (fileStats.isFile()) {
			const fileContents = fs.readFileSync(sourceFilePath, ENCODING);

			// Convert .npmignore to .gitignore if necessary
			const targetFileName = sourceFile === NPM_IGNORE_FILE ? GIT_IGNORE_FILE : sourceFile;

			const targetFilePath = path.join(CURRENT_WORKING_DIR, targetProjectPath, targetFileName);

			fs.writeFileSync(targetFilePath, fileContents, ENCODING);
		} else if (fileStats.isDirectory()) {
			const targetDirPath = path.join(CURRENT_WORKING_DIR, targetProjectPath, sourceFile);
			fs.mkdirSync(targetDirPath);

			// Recursive call for subdirectories
			createDirectoryContents(
				path.join(sourceTemplatePath, sourceFile),
				path.join(targetProjectPath, sourceFile),
			);
		}
	}
};

export default createDirectoryContents;
