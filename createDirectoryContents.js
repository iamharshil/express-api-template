import fs from "node:fs";
import path from "node:path";

function findConflicts(templatePath, destinationPath, relativePath = "") {
    const conflicts = [];

    for (const entry of fs.readdirSync(templatePath, { withFileTypes: true })) {
        const name = entry.name === ".npmignore" ? ".gitignore" : entry.name;
        const sourcePath = path.join(templatePath, entry.name);
        const targetPath = path.join(destinationPath, name);
        const relativeTargetPath = path.join(relativePath, name);

        if (fs.existsSync(targetPath)) {
            const targetIsDirectory = fs.statSync(targetPath).isDirectory();
            if (!entry.isDirectory() || !targetIsDirectory) {
                conflicts.push(relativeTargetPath);
                continue;
            }
        }

        if (entry.isDirectory()) {
            conflicts.push(...findConflicts(sourcePath, targetPath, relativeTargetPath));
        }
    }

    return conflicts;
}

function copyDirectoryContents(templatePath, destinationPath) {
    fs.mkdirSync(destinationPath, { recursive: true });

    for (const entry of fs.readdirSync(templatePath, { withFileTypes: true })) {
        const name = entry.name === ".npmignore" ? ".gitignore" : entry.name;
        const sourcePath = path.join(templatePath, entry.name);
        const targetPath = path.join(destinationPath, name);

        if (entry.isDirectory()) {
            copyDirectoryContents(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath, fs.constants.COPYFILE_EXCL);
        }
    }
}

const createDirectoryContents = (templatePath, destinationPath) => {
    const conflicts = findConflicts(templatePath, destinationPath);
    if (conflicts.length) {
        throw new Error(`These files already exist: ${conflicts.join(", ")}. Move them or choose another folder.`);
    }

    copyDirectoryContents(templatePath, destinationPath);
};

export default createDirectoryContents;
