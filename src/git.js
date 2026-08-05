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

export async function getLastNCommits(n=2) {
  const log = await git.log({ maxCount: n });

  if (!log.all.length) {
    console.log("No commits found in this repository.");
    process.exit(0);
  }

  // Build a summary: commit hash + message + diff for each commit
  const parts = [];
  for (const commit of log.all) {
    const diff = await git.show([commit.hash, "--stat", "--patch", "-U3"]);
    parts.push(`Commit: ${commit.hash.slice(0, 7)}\nMessage: ${commit.message}\n${diff}`);
  }

  const combined = parts.join("\n---\n");
  // Cap at 12000 chars to avoid token overflow
  return combined.slice(0, 12000);
}