#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const GIT_REPO_URL =
  "https://github.com/junseokku/node_typescript_projects_boilerplate.git";

const TARGET_DIR = "packages/test-package";

const main = async () => {
  try {
    console.log("Downloading files...");

    runCommand("git init");
    runCommand(`git remote add origin ${GIT_REPO_URL}`);

    // 3. sparse-checkout 활성화 및 원하는 디렉토리 설정
    runCommand("git sparse-checkout init --cone");
    runCommand(`git sparse-checkout set ${TARGET_DIR}`);

    // 4. 원격 저장소에서 가져오기
    // runCommand("git pull origin master");

    runCommand(`git clone --depth 1 ${GIT_REPO_URL} ${projectPath}`);

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

const runCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: "inherit", ...options });
  } catch (err) {
    console.error(`Error executing command: ${command}`);
    console.error(err);
    process.exit(1);
  }
};

(async () => {
  if (process.argv.length < 3) {
    console.error("Please provide a name for the app");
    process.exit(1);
  }

  const projectName = process.argv[2];
  const currentPath = process.cwd();
  const projectPath = path.join(currentPath, projectName);

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

  void main();
})();
