"use server";

import { Part } from "@google/generative-ai";
import { Attempt } from "../common";
import { extractSectionFromResponse, getImageBlob } from "./utils";
import { getGemini } from "./gemini";

export async function generatePromptForImageGeneration(
  story: string,
  attempts: Attempt[],
  numRetries = 3
): Promise<string> {
  let numRetry = 0;
  const sectionName = "# Output";
  while (numRetry < numRetries) {
    try {
      const promptInParts = await getPromptInstructionForImageGeneration(
        story,
        attempts
      );
      const response = await getGemini().generateContent(promptInParts);
      return extractSectionFromResponse(sectionName, response.response.text());
    } catch (error) {
      numRetry++;
    }
  }

  throw Error(
    `Something went wrong. Can not generate prompt for image generation after ${numRetries} retries.`
  );
}

async function getPromptInstructionForImageGeneration(
  story: string,
  attempts: Attempt[]
): Promise<Part[]> {
  const instructionPart = {
    text: `
          Write a prompt for AI image generation for models like Imagen, Stable Diffusion, or Dall-E. The image should be based on the story below. 
          The prompt needs to be short, concise, and capture the core essence of the story. Avoid inappropriate content.
          "Attempt History" section holds the output prompt that has been attempted and require further improvement. 
  
          Think step by step in the "Thought" section. 
          Finally, output the prompt in the Output section.
  
          ## Story
          ${story}
  
          ## Attempt History
          `,
  };

  const outputPart = {
    text: `
          ## Thought
          Write thought here
  
          ## Output
          `,
  };

  const attemptsPart = await convertAttemptsToTextImageParts(attempts);
  return [instructionPart, ...attemptsPart, outputPart];
}

async function convertAttemptsToTextImageParts(
  attempts: Attempt[]
): Promise<Part[]> {
  if (!attempts || attempts.length == 0) {
    return [];
  }

  const parts: Part[] = [];
  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    parts.push(
      {
        text: `
              ### Attempt ${i + 1}
              # Prompt: ${attempt.imagePrompt}
              # Reason: ${attempt.reason}
              # Improvement Tips: ${attempt.improvement}
              # Image: 
              `,
      },
      await getImageBlob(attempt.imagePath)
    );
  }

  return parts;
}
