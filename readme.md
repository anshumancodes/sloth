# 🦥 slothcommit

**slothcommit** is an open-source AI-powered Git commit assistant that generates clean **conventional commit messages** based on your staged file changes.

Instead of manually writing commit messages, slothcommit analyzes your **git diff** and automatically generates a concise commit message.


## Features

- AI-generated commit messages after analyzing your changes
-  Conventional commit format  
-  One command workflow

## Why I Built This

I hate writing commit messages manually.

Earlier my workflow looked like this:

1. Copy my code changes  
2. Paste them into GPT  
3. Ask it to generate a commit message  
4. Copy the result back to terminal  
5. Finally run `git commit`

It was slow and annoying.

So I built **slothcommit** a small CLI that does everything in **one command**.



## Installation

Install globally via npm:

```bash
npm install -g slothcommit
```
## Setup API Key

The first time you run sloth, the CLI will prompt you for your Gemini API key and store it securely.

You can get a key from Google AI. 
[Google ai studio](https://aistudio.google.com/)

```
sloth
Enter your Gemini API Key: ********
```

After that, it won't ask again.
## Usage

- Stage your files
git add .
- Run sloth
```sloth```
- Done ,sloth generates a commit message for you.

Example output:

```feat(auth): add refresh token middleware```

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