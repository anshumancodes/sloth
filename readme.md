# 🦥 slothcommit

**slothcommit** is an open-source AI-powered Git commit assistant that generates clean **conventional commit messages** based on your staged file changes.

Instead of manually writing commit messages, slothcommit analyzes your **git diff** and automatically generates a concise commit message.


## Features

- 🤖 AI-generated commit messages based on your staged diff
- 🚀 PR title & description generator from recent commits
- 📐 Conventional commit format
- ⚡ One command workflow
- 🔄 Multi-model support (Gemini Flash, Pro, and more)

## Why I Built This

I hate writing commit messages manually.

Earlier my workflow looked like this:

1. Copy my code changes  
2. Paste them into GPT  
3. Ask it to generate a commit message  
4. Copy the result back to terminal  
5. Finally run `git commit`

It was slow and annoying.

So I built **slothcommit** — a small CLI that does everything in **one command**.



## Installation

Install globally via npm:

```bash
npm install -g slothcommit
```

## Setup API Key

The first time you run sloth, the CLI will prompt you for your Gemini API key and store it securely.

You can get a key from Google AI.  
[Google AI Studio](https://aistudio.google.com/)

```
sloth
Enter your Gemini API Key: ********
```

After that, it won't ask again.

## Usage

### Commit Message Generation

Stage your files and run `sloth` — it analyzes your diff and generates a conventional commit message.

```bash
git add .
sloth
```

Example output:

```
✨ Suggested Commit Message:

feat(auth): add refresh token middleware

Use this message? (Y/n):
```

Press **Enter** or type `y` to commit. Type `n` to cancel.

---

### PR Title & Description

Generate a PR title and description based on your last N commits:

```bash
sloth --pr        # analyzes last 5 commits (default)
sloth --pr 3      # analyzes last 3 commits
sloth --pr 10     # analyzes last 10 commits
```

Example output:

```
🔍 Analyzing last 5 commit(s)...

🚀 Suggested PR Title & Description:

Title: feat(cli): add PR generation and improve commit UX

Description:
- Add --pr command to generate PR title and description from recent commits
- Default Enter key press to confirm commit message
- Add getLastNCommits helper to fetch commit diffs
- Add generatePRDescription LLM prompt with structured output
```

---

### Model Management

```bash
sloth --model                        # show currently active model
sloth --set-model gemini-2.5-flash   # switch to a different model
```

Available models:
- `gemini-2.5-flash-lite` *(default)*
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-2.0-flash`
- `gemini-1.5-flash`
- `gemini-1.5-pro`

---

### API Key Management

```bash
sloth --set-api-key <your-key>   # update your stored Gemini API key
```

## Contributing

Contributions, ideas, and improvements are welcome.

Open an issue or submit a PR.

- Connect With Me

Suggestions are welcome.

- Email: anshumanprof01@gmail.com

- Blog

https://anshumancdx.xyz/blog

- Newsletter

https://newsletter.anshumancdx.xyz/

### Support the Project

If you find this useful, consider giving the repo a star at
[https://github.com/anshumancodes/sloth](https://github.com/anshumancodes/sloth)


## buy me a coffee

[buy me a coffee](https://buymeacoffee.com/anshumancdx)
