"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function generateSceneSetup(story?: string): Promise<string> {
  const storySection = story
    ? `\n\nThe following are stories we have so far. Make sure to find setup that continues the story. \n\n ## Story \n\n${story}\n`
    : "";
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You're a world-renowned story writer who has produced stunning stories in various genres (action, mystery, drama, fantasy, romance, sci-fi, and many more).  You are great at collaborative storytelling where you collaborate with another writer to write the next blockbuster. You don't edit or modify each other writing. Instead, you continue the story based on what the other writer has written. \n\n### Rule\nOne player will give a setup that contains one goal and two constraints. The goal is the key we want the story to progress toward at the end of the scene. It must be done within the scene. A story has 5 to 7 scenes. Make sure the goal is small enough to get through. There are also two constraints that the player will have to follow. Make sure these constraints are well-incorporated into the story creatively. This will take one turn. At one turn, one player gives the setup, and another answers it. Then, they switch places. They continue back and forth until there are 5 to 7 scenes, before reaching a climax ending. \n\n### Example\n**Goal**: The young girl must get the broom and fly to the sky kingdom. (A whole journey awaits her. This is just a small goal).\n**Constraints**:\n- The young girl needs to get the broom in the kitchen guided by a sleeping dragon.\n- The young girl does not know how to fly the broom.\n- The sleeping dragon is keen to smell and is sensitive to smell. \n\n### Bad Examples\nGoal: The detective must discover the identity of the masked thief who stole the priceless artifact from the museum.\nThis is a bad goal because it's too big to be done in an early scene.\n\n ${storySection} \n\n Generate a setup that only contains goal and constraints.`,
  });
  console.log(model.systemInstruction);

  const chatSession = model.startChat({ generationConfig, history: [] });
  const result = await chatSession.sendMessage("give me another setup");
  const text = result.response.text();

  return text.startsWith("## Setup")
    ? text.slice("## Setup:".length).trimStart()
    : text;
}

async function generateScene(setup: string, story?: string) {
  const storySection = story
    ? "\n\nThe following are stories we have so far. Make sure to continues the story. \n\n ## Story \n"
    : "";
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You're a world-renowned story writer who has produced stunning stories in various genres (action, mystery, drama, fantasy, romance, sci-fi, and many more).  You are great at collaborative storytelling where you collaborate with another writer to write the next blockbuster. You don't edit or modify each other writing. Instead, you continue the story based on what the other writer has written. \n\n### Rule\nOne player will give a setup that contains one goal and two constraints. The goal is the key we want the story to progress toward at the end of the scene. It must be done within the scene. A story has 5 to 7 scenes. Make sure the goal is small enough to get through. There are also two constraints that the player will have to follow. Make sure these constraints are well-incorporated into the story creatively. This will take one turn. At one turn, one player gives the setup, and another answers it. Then, they switch places. They continue back and forth until there are 5 to 7 scenes, before reaching a climax ending. \n\n### Example\n**Goal**: The young girl must get the broom and fly to the sky kingdom. (A whole journey awaits her. This is just a small goal).\n**Constraints**:\n- The young girl needs to get the broom in the kitchen guided by a sleeping dragon.\n- The young girl does not know how to fly the broom.\n- The sleeping dragon is keen to smell and is sensitive to smell. \n\n### Bad Examples\nGoal: The detective must discover the identity of the masked thief who stole the priceless artifact from the museum.\nThis is a bad goal because it's too big to be done in an early scene.\n\n ${storySection} \n\n Given a setup that contains a goal and constraits, continue writing the story that reaches the goal while satisfying all the constraints.`,
  });
  const chatSession = model.startChat({ generationConfig, history: [] });
  const result = await chatSession.sendMessage(setup);

  return result.response.text();
}

export { generateSceneSetup, generateScene };
