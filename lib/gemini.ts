import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const MODEL = "gemini-2.5-flash"; // current stable model

export const geminiModel = genAI.getGenerativeModel({
  model: MODEL,
});

export const MAX_TOKENS = 4096;

export default genAI;
