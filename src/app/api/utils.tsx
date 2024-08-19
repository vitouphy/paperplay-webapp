import { InlineDataPart } from "@google/generative-ai";
import { readFile } from "fs/promises";

function extractSectionFromResponse(sectionName: string, text: string): string {
  const indexFound = text.indexOf(sectionName);
  if (indexFound !== -1) {
    return text.slice(indexFound + sectionName.length).trim();
  }

  throw new Error(`Section ${sectionName} can not be found in text ${text}`);
}

async function getImageBlob(imagePath: string): Promise<InlineDataPart> {
  try {
    const fileBuffer = await readFile(imagePath);
    return {
      inlineData: {
        mimeType: "image/png",
        data: fileBuffer.toString("base64"),
      },
    };
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
}

export { extractSectionFromResponse, getImageBlob };
