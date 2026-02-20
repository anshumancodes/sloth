import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
