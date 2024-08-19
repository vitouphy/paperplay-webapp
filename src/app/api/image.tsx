"use server";
import { OpenAI } from "openai";
import { createWriteStream } from "fs";
import { get } from "https";
import path, { join } from "path";
import { generateRandomFilename } from "../utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Attempt, ImageCriticOutput } from "../common";
import { generatePromptForImageGeneration } from "./imagePromptGenerator";
import { getImageBlob } from "./utils";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const openAiApiKey = process.env.OPEN_AI_API_KEY || "";
const openAiClient = new OpenAI({ apiKey: openAiApiKey });

enum ImageModel {
  DALLE_2,
  DALLE_3,
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig,
});

export async function generateSceneImage(
  story: string,
  imageModel: ImageModel = ImageModel.DALLE_2
): Promise<string | null> {
  return generateImageWithFeedbackLoops(story, imageModel);
}

async function generateImageWithFeedbackLoops(
  story: string,
  imageModel: ImageModel = ImageModel.DALLE_2,
  numFeedbackLoops: number = 3
): Promise<string | null> {
  const attempts: Attempt[] = [];
  let result = null;

  for (let i = 0; i < numFeedbackLoops; i++) {
    const imagePrompt = await generatePromptForImageGeneration(story, attempts);
    result = await generateImage(imagePrompt!, imageModel);
    const [imageUrl, imagePath] = result;

    const critic = await criticImageOutput(imagePath, story, 3);

    // Retry if something is wrong for whatever reason
    if (!critic) break;

    // If the quality matches, no need to searh further. Return the value
    if (critic.decision === 1) break;

    attempts.push({
      imagePrompt: imagePrompt!,
      reason: critic.reason,
      improvement: critic.improvement,
      imagePath: imagePath,
    });
  }

  if (result) {
    const [imageUrl, imagePath] = result;
    const baseDir = path.join("/Users/vitou/workspace/paperplay/webapp/public");
    return path.relative(baseDir, imagePath);
  }

  return result;
}

async function generateImage(
  prompt: string,
  imageModel: ImageModel = ImageModel.DALLE_2
) {
  const useDalle3 = imageModel == ImageModel.DALLE_3;
  const modelName = useDalle3 ? "dall-e-3" : "dall-e-2";
  const size = useDalle3 ? "1024x1024" : "512x512";

  const response = await openAiClient.images.generate({
    model: modelName,
    prompt: prompt,
    size: size,
    quality: "standard",
    n: 1,
  });

  const imageUrl = response.data[0].url as string;
  const filepath = await downloadImage(imageUrl);
  return [imageUrl, filepath];
}

async function criticImageOutput(
  imagePath: string,
  story: string,
  numAttempts: number = 1
): Promise<ImageCriticOutput | null> {
  for (let attempt = 0; attempt < numAttempts; attempt++) {
    try {
      const response = await model.generateContent([
        `
                Does the image reflect the core of the story? The main character needs to be in the picture. The image has to be good quality. Avoid unclear images.
                Think step by step in the #Thought section. 
                Then, give a thorough and concise reason why the image is a fit or a misfit and put it in the #reason section.
                Then, if the image is a misfit, give suggestions on how to improve. Write N/A if the image fits. Write in the #improvement section.
                Finally, decide if the image matches with the core of the story. 0 if the image does not match. 1 if the image matches.

                # Story
                ${story}

                # Thought
                // write the thought step by step here

                # Reason
                // provide reason here

                # Improvement

                # Decision 
                // it should be a 1 or 0.
                `,
        await getImageBlob(imagePath),
      ]);

      const output = response.response.text();

      const reasonTarget = "# Reason";
      const improvementTarget = "# Improvement";
      const decisionTarget = "# Decision";

      const reasonIndex = output.indexOf(reasonTarget);
      const improvementIndex = output.indexOf(improvementTarget);
      const decisionIndex = output.indexOf(decisionTarget);

      const reason = output
        .slice(reasonIndex + reasonTarget.length, improvementIndex)
        .trim();
      const improvement = output
        .slice(improvementIndex + improvementTarget.length, decisionIndex)
        .trim();
      const decision = parseInt(
        output.slice(decisionIndex + decisionTarget.length).trim()[0]
      );

      return {
        output,
        reason,
        improvement,
        decision,
      };
    } catch (e) {
      console.error(`An unexpected error occurred: ${(e as Error).message}`);
    }
  }

  return null;
}

async function downloadImage(url: string): Promise<string> {
  const filename = generateRandomFilename();
  const filepath = join(process.cwd(), "public", "downloads", filename); // Save to 'public/downloads/'

  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);

    get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(filepath);
      });
    }).on("error", (err) => {
      reject(err.message);
    });
  });
}
