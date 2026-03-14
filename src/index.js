#!/usr/bin/env node

import readline from "readline";
import simpleGit from "simple-git";
import { getStagedDiff } from "./git.js";
import { 
  generateCommitMessage,
  setModel,
  getCurrentModel,
  promptModelSwitch,
  AVAILABLE_MODELS,
 } from "./llm.js";

const git = simpleGit();
const args = process.argv.slice(2);

// command: sloth --set-model <model-name>
if (args[0] === "--set-model") {

  const modelArg = args[1];
  if (!modelArg) {
    console.log("Available Models: ");
    AVAILABLE_MODELS.forEach((m, i) => console.log(' ${i + 1}. ${m}'));

    console.log("\nUsage: sloth --set-model <model-name>");
    process.exit(0);
  }
  setModel(modelArg);
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

async function run() {
  try {
    const diff = await getStagedDiff();
    const message = await generateCommitMessage(diff);

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
