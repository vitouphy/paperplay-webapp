import { randomBytes } from "crypto";
import { Scene } from "./common";

export const getEntireStory = (
  scenes: Scene[],
  currentScene?: Scene,
  includeCurrentState = false
) => {
  const arr =
    includeCurrentState || !currentScene
      ? scenes
      : scenes.filter((tmpScene) => tmpScene != currentScene);

  return arr
    .map((tmpScene, index) => `## Scene ${index + 1}\n\n${tmpScene.content}`)
    .join("\n");
};

export function generateRandomFilename(extension: string = "png"): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const id = Array.from(randomBytes(16))
    .map((byte) => characters[byte % characters.length])
    .join("");
  return `${id}.${extension}`;
}
