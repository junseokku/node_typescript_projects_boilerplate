#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

if (process.argv.length < 3) {
  console.error("Please provide a name for the app");
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);

const GIT_REPO_URL =
  "https://github.com/junseokku/node_typescript_projects_boilerplate.git";

if (projectName !== ".") {
  try {
    await fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === "EEXIST") {
      console.error(`The file ${projectPath} already exists`);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

const main = async () => {
  try {
    console.log("Downloading files...");
    execSync(`git clone --depth 1 ${GIT_REPO_URL} ${projectPath}`);

    if (projectName !== ".") {
      process.chdir(projectPath);
    }

    console.log("Installing dependencies...");
    execSync("npm install");

    console.log("Removing .git folder...");
    execSync("rm -rf .git");

    console.log("Project is ready");
  } catch (err) {
    console.error(err);
  }
};
