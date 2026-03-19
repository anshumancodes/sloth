#!/usr/bin/env node

import readline from "readline";
import simpleGit from "simple-git";
import { getStagedDiff } from "./git.js";
import { 
  generateCommitMessage,
  setModel,
  setApiKey,
  getCurrentModel,
  promptKeySwitch,
  AVAILABLE_MODELS,
 } from "./llm.js";

const git = simpleGit();
const args = process.argv.slice(2);

// command: sloth --set-model <model-name>
if (args[0] === "--set-model") {

  const modelArg = args[1];
  if (!modelArg) {
    console.log("Available Models: ");
    AVAILABLE_MODELS.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));

    console.log("\nUsage: sloth --set-model <model-name>");
    process.exit(0);
  }
  setModel(modelArg);
  process.exit(0);
}

// command: sloth --model (shows the current model in use)
if (args[0] === "--model") {

  console.log(`Current Model: ${getCurrentModel()}`);
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
    console.log("Usage: sloth --set-api-key <your-gemini-api-key>");
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
      if (err.status === 429 || (err.message && err.message.includes ("429"))) {

        const newModel = await promptKeySwitch();
        if (newModel) {

          message = await generateCommitMessage(diff);
        } else {
          console.log("Run `sloth --set-api-key <key>` when you have a new key.");
          process.exit(1);
        }
      } else {
        throw err;
      }
    }

    console.log("\n✨ Suggested Commit Message:\n");
    console.log(message);
    console.log("");

    const answer = await askQuestion("Use this message? (y/n): ");

    if (answer === "y" || answer === "yes") {
      await git.commit(message);
      console.log("Commit created!");
    } else {
      console.log(" Commit cancelled.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
