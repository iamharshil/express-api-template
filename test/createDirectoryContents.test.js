import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import createDirectoryContents from "../createDirectoryContents.js";

function createFixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "express-api-template-"));
    const template = path.join(root, "template");
    const destination = path.join(root, "project");
    fs.mkdirSync(path.join(template, "config"), { recursive: true });
    fs.mkdirSync(destination);
    fs.writeFileSync(path.join(template, ".npmignore"), "node_modules\n");
    fs.writeFileSync(path.join(template, "config", "database.js"), "export default {};\n");
    return { root, template, destination };
}

test("copies a template into an existing directory and renames .npmignore", (t) => {
    const { root, template, destination } = createFixture();
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));

    createDirectoryContents(template, destination);

    assert.equal(fs.readFileSync(path.join(destination, ".gitignore"), "utf8"), "node_modules\n");
    assert.equal(fs.readFileSync(path.join(destination, "config", "database.js"), "utf8"), "export default {};\n");
});

test("reports conflicts before copying any template files", (t) => {
    const { root, template, destination } = createFixture();
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.writeFileSync(path.join(destination, ".gitignore"), "keep me\n");

    assert.throws(() => createDirectoryContents(template, destination), /\.gitignore/);
    assert.equal(fs.readFileSync(path.join(destination, ".gitignore"), "utf8"), "keep me\n");
    assert.equal(fs.existsSync(path.join(destination, "config")), false);
});
