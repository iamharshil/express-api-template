import fs from "node:fs";
import path from "node:path";
const CURR_DIR = process.cwd();

const createDirectoryContents = (templatePath, newProjectPath) => {
	const filesToCreate = fs.readdirSync(templatePath);

	for (let file of filesToCreate) {
		const origFilePath = path.join(templatePath, file);
		const stats = fs.statSync(origFilePath);

		if (stats.isFile()) {
			const contents = fs.readFileSync(origFilePath, "utf8");

			if (file === ".npmignore") {
				file = ".gitignore";
			}

			const writePath = path.join(CURR_DIR, newProjectPath, file);
			fs.writeFileSync(writePath, contents, "utf8");
		} else if (stats.isDirectory()) {
			fs.mkdirSync(path.join(CURR_DIR, newProjectPath, file));
			createDirectoryContents(path.join(templatePath, file), path.join(newProjectPath, file));
		}
	}
};

export default createDirectoryContents;
