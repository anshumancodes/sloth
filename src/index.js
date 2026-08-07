#!/usr/bin/env node

import readline from "readline";
import simpleGit from "simple-git";
import chalk from "chalk";
import { getStagedDiff, getLastNCommits } from "./git.js";
import { 
  generateCommitMessage,
  generatePRDescription,
  setModel,
  setApiKey,
  getCurrentModel,
  promptKeySwitch,
  AVAILABLE_MODELS,
 } from "./llm.js";


const git = simpleGit();
const args = process.argv.slice(2);

// command: sloth --help
if (args[0] === "--help" || args[0] === "-h") {
  console.log(`
${chalk.yellow("🦥 sloth")} ${chalk.dim("—")} ${chalk.white("Ai native git commit & PR assistant")}

${chalk.bold.underline("USAGE")}
  ${chalk.cyan("sloth")} ${chalk.dim("[flag] [options]")}

${chalk.bold.underline("FLAGS")}
  ${chalk.dim("(no flag)")}                   Stage your changes, then run ${chalk.cyan("`sloth`")} to generate
                              and confirm an AI commit message.

  ${chalk.cyan("--help")}, ${chalk.cyan("-h")}                  Show this help message.

  ${chalk.cyan("--model")}                     Show the currently active AI model.

  ${chalk.cyan("--set-model")} ${chalk.yellow("<model-name>")}    Switch to a different AI model.
                              Run without a model name to list available models.

  ${chalk.cyan("--set-api-key")} ${chalk.yellow("<key>")}         Save your Gemini API key for use by sloth.

  ${chalk.cyan("--pr")} ${chalk.yellow("[n]")}                    Generate a PR title & description from the last
                              n commits ${chalk.dim("(default: 5)")}.

${chalk.bold.underline("EXAMPLES")}
  ${chalk.green("sloth")}                       Generate a commit message for staged changes.
  ${chalk.green("sloth --pr")}                  Generate a PR description from last 5 commits.
  ${chalk.green("sloth --pr 10")}               Generate a PR description from last 10 commits.
  ${chalk.green("sloth --set-model gemini-pro")}
  ${chalk.green("sloth --set-api-key AIza...")}
`);
  process.exit(0);
}

// command: sloth --set-model <model-name>
if (args[0] === "--set-model") {

  const modelArg = args[1];
  if (!modelArg) {
    console.log(chalk.bold("\nAvailable Models:"));
    AVAILABLE_MODELS.forEach((m, i) => console.log(`  ${chalk.dim(`${i + 1}.`)} ${chalk.cyan(m)}`));

    console.log(`\n${chalk.dim("Usage:")} ${chalk.cyan("sloth --set-model <model-name>")}\n`);
    process.exit(0);
  }
  setModel(modelArg);
  process.exit(0);
}

// command: sloth --model (shows the current model in use)
if (args[0] === "--model") {

  console.log(`${chalk.dim("Current Model:")} ${chalk.cyan(getCurrentModel())}`);
  process.exit(0);
}

// command: sloth --pr [n]  — generate a PR title + description from last n commits
if (args[0] === "--pr") {
  const n = parseInt(args[1], 10) || 5;

  console.log(`\n${chalk.blue("🔍")} ${chalk.bold(`Analyzing last ${chalk.cyan(n)} commit(s)...`)}\n`);

  try {
    const commitsContext = await getLastNCommits(n);
    const prContent = await generatePRDescription(commitsContext, n);

    console.log(`\n${chalk.magenta("🚀")} ${chalk.bold("Suggested PR Title & Description:")}\n`);
    console.log(chalk.white(prContent));
    console.log("");
  } catch (err) {
    console.error(`${chalk.red("✖ Error generating PR description:")} ${err.message}`);
  }

  process.exit(0);
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim().toLowerCase());
    })
  );
}

// command: sloth --set-api-key <key>
if (args[0] === "--set-api-key") {
  const keyArg = args[1];
  if (!keyArg) {
    console.log(`${chalk.dim("Usage:")} ${chalk.cyan("sloth --set-api-key <your-gemini-api-key>")}`);
    process.exit(0);
  }
  setApiKey(keyArg);
  process.exit(0);
}

async function run() {
  try {
    const diff = await getStagedDiff();
    let message;

    try {
      message = await generateCommitMessage(diff);
    } catch (err) {
      if (err.status === 429 || (err.message && err.message.includes("429"))) {

        const newModel = await promptKeySwitch();
        if (newModel) {

          message = await generateCommitMessage(diff);
        } else {
          console.log(chalk.yellow(`Run ${chalk.cyan("`sloth --set-api-key <key>`")} when you have a new key.`));
          process.exit(1);
        }
      } else {
        throw err;
      }
    }

    console.log(`\n${chalk.yellow("✨")} ${chalk.bold("Suggested Commit Message:")}\n`);
    console.log(chalk.white(message));
    console.log("");

    const answer = await askQuestion(chalk.bold("Use this message? ") + chalk.dim("(Y/n): "));

    if (answer === "y" || answer === "yes" || answer === "") {
      await git.commit(message);
      console.log(`${chalk.green("✔")} ${chalk.bold("Commit created!")}`);
    } else {
      console.log(`${chalk.red("✖")} ${chalk.dim("Commit cancelled.")}`);
    }
  } catch (err) {
    console.error(`${chalk.red("✖ Error:")} ${err.message}`);
  }
}

run();
