"use server";

import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";
import {
  PROMPT_SCENE_SETUP,
  PROMPT_SCENE_WRITE,
  PROMPT_STORY_SECTION,
} from "./prompts";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function generateSceneSetup(story?: string): Promise<string> {
  const storySection = getPromptStorySection(story);
  const prompt = PROMPT_SCENE_SETUP.replace("[STORY_SECTION]", storySection);

  const chatSession = createModelAndStartSession(prompt);
  const modelResponse = await chatSession.sendMessage("Give me another setup");

  const setupSection = "## Setup:";
  return extractSectionFromResponse(
    setupSection,
    modelResponse.response.text()
  );
}

export async function generateScene(setup: string, story?: string) {
  const storySection = getPromptStorySection(story);
  const prompt = PROMPT_SCENE_WRITE.replace("[STORY_SECTION]", storySection);

  const chatSession = createModelAndStartSession(prompt);
  const result = await chatSession.sendMessage(setup);

  return result.response.text();
}

function getPromptStorySection(story?: string): string {
  const hasStory = story && story.trim() != "";
  return hasStory ? PROMPT_STORY_SECTION.replace("[STORY_SECTION]", story) : "";
}

function createModelAndStartSession(prompt: string): ChatSession {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: prompt,
  });

  const chatSession = model.startChat({ generationConfig });
  return chatSession;
}

function extractSectionFromResponse(sectionName: string, text: string): string {
  return text.startsWith(sectionName)
    ? text.slice(sectionName.length).trimStart()
    : text;
}
