#!/usr/bin/env node

import readline from "readline";
import simpleGit from "simple-git";
import { getStagedDiff } from "./git.js";
import { generateCommitMessage } from "./llm.js";

const git = simpleGit();

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