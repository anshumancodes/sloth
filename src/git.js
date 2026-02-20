import simpleGit from "simple-git";

const git = simpleGit();

export async function getStagedDiff() {
  const diff = await git.diff(["--cached"]);
  if (!diff.trim()) {
    console.log("No staged changes.");
    process.exit(0);
  }
  // basically i trimmed the context passed to llm avoid token overflow
  return diff.slice(0, 8000); 
}