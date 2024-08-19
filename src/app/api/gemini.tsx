import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const getGemini = (configuration?: GenerationConfig) => {
  const config = configuration ?? generationConfig;
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: config,
  });
};

export { getGemini };
