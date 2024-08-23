"use server";
import { OpenAI } from "openai";
import { createWriteStream } from "fs";
import { get } from "https";
import { join } from "path";
import { Attempt, ImageEvaluation, ImageModel } from "../common";
import { generatePromptForImageGeneration } from "./imagePromptGenerator";
import { generateRandomFilename, getImageBlob } from "./utils";
import { getGemini } from "./gemini";
import { PROMPT_EVALUAGE_IMAGE_WITH_STORY } from "./prompts";

const openAiApiKey = process.env.OPEN_AI_API_KEY || "";
const openAiClient = new OpenAI({ apiKey: openAiApiKey });

export async function generateSceneImage(
  story: string,
  imageModel: ImageModel = ImageModel.DALLE_2
): Promise<string> {
  return generateImageWithFeedbackLoops(story, imageModel);
}

async function generateImageWithFeedbackLoops(
  story: string,
  imageModel: ImageModel = ImageModel.DALLE_2,
  numFeedbackLoops: number = 3
): Promise<string> {
  let generatedImage = null;
  const attempts: Attempt[] = [];
  for (let i = 0; i < numFeedbackLoops; i++) {
    const imagePrompt = await generatePromptForImageGeneration(story, attempts);
    generatedImage = await generateImage(imagePrompt, imageModel);

    const { imagePath } = generatedImage;
    const imageEvaluation = await evaluateImageWithStory(imagePath, story, 3);

    if (imageEvaluation.decision === 1) break;

    attempts.push({
      imagePrompt: imagePrompt!,
      reason: imageEvaluation.reason,
      improvement: imageEvaluation.improvement,
      imagePath: imagePath,
    });
  }

  if (generatedImage) {
    return join("/api", "file", generatedImage.filename);
  }

  throw Error(
    `Something went wrong. Can not generate image with feedback loops after ${numFeedbackLoops} attempts.`
  );
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
  const filename = generateRandomFilename();
  const imagePath = await downloadImage(imageUrl, filename);

  return { imageUrl, imagePath, filename };
}

async function evaluateImageWithStory(
  imagePath: string,
  story: string,
  numRetries: number = 1
): Promise<ImageEvaluation> {
  for (let i = 0; i < numRetries; i++) {
    try {
      const textPromptPart = PROMPT_EVALUAGE_IMAGE_WITH_STORY.replace(
        "[STORY]",
        story
      );
      const imagePromptPart = await getImageBlob(imagePath);
      const response = await getGemini().generateContent([
        textPromptPart,
        imagePromptPart,
      ]);

      const evaluationResponse = response.response.text();
      return extractImageEvaluationFromLLMResponse(evaluationResponse);
    } catch (e) {
      console.error(`An unexpected error occurred: ${(e as Error).message}`);
    }
  }
  throw Error(
    `Something went wrong. Can not evaluate image quality after ${numRetries} retries.`
  );
}

function extractImageEvaluationFromLLMResponse(
  response: string
): ImageEvaluation {
  const reasonTarget = "# Reason";
  const improvementTarget = "# Improvement";
  const decisionTarget = "# Decision";

  const reasonIndex = response.indexOf(reasonTarget);
  const improvementIndex = response.indexOf(improvementTarget);
  const decisionIndex = response.indexOf(decisionTarget);

  const reason = response
    .slice(reasonIndex + reasonTarget.length, improvementIndex)
    .trim();
  const improvement = response
    .slice(improvementIndex + improvementTarget.length, decisionIndex)
    .trim();
  const decision = parseInt(
    response.slice(decisionIndex + decisionTarget.length).trim()[0]
  );

  return {
    output: response,
    reason,
    improvement,
    decision,
  };
}

async function downloadImage(url: string, filename: string): Promise<string> {
  const filepath = join(process.cwd(), "public", "downloads", filename);

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
