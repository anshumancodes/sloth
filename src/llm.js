import Conf from "conf";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = new Conf({ projectName: "sloth" });

export const AVAILABLE_MODELS = [

  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

let apiKey = process.env.GEMINI_API_KEY || config.get("GEMINI_API_KEY");

if (!apiKey) {
  const inputFromTerminal = readline.createInterface({ input, output });

  apiKey = await inputFromTerminal.question("Enter your Gemini API Key: ");
  inputFromTerminal.close();

  config.set("GEMINI_API_KEY", apiKey);
  console.log("yay! API key saved for future use.");
}


if(!apiKey){
  console.log("Missing Gemini api Key! please export it like export GEMINI_API_KEY=<YOUR KEY>")
}
const genAI = new GoogleGenerativeAI(apiKey);

export function getCurrentModel(){

  return config.get("GEMINI_MODEL") || DEFAULT_MODEL;
}

export function setModel(modelName){
  if (!AVAILABLE_MODELS.includes(modelName)) {

    console.error(`Invalid model. Available models:\n${AVAILABLE_MODELS.map((m, i) => `  ${i + 1}. ${m}`).join("\n")}`);
    process.exit(1);
  }
  config.set("GEMINI_MODEL", modelName);
  console.log(` Model set to: ${modelName}`);
}

export async function promptModelSwitch() {

  const r1 = readline.createInterface({input, output});
  console.log("\n Quota Exceeded...Select an Alternative Model: ");
  
  AVAILABLE_MODELS.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));

  const answer = await r1.question("\nEnter model number to switch (or Press Enter to cancel...)");
  r1.close();

  const idx = parseInt(answer) - 1;
  if (!isNaN(idx) && idx >= 0 && idx < AVAILABLE_MODELS.length) {

    const chosen = AVAILABLE_MODELS[idx];
    config.set("GEMINI_MODEL", chosen);
    console.log(`Switched to: ${chosen}\n`);
    return chosen;
  }
  return null;

}

export async function generateCommitMessage(diff) {
  const model = genAI.getGenerativeModel({
  model: getCurrentModel(),
});

  const prompt = `
You are an expert Git assistant.

Output ONLY one commit message.

Rules:
- Conventional commit
- Max 72 chars
- Imperative tense
- Use format: type(scope): message [strictly follow this template]
- Example(format): feat(auth): add refresh token middleware 

Diff:
${diff}
`;
  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text().trim();
}
