import Conf from "conf";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = new Conf({ projectName: "sloth" });

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

export async function generateCommitMessage(diff) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite", 
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
