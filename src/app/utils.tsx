"use client";

import { Scene } from "./common";
import MarkdownIt from "markdown-it";

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

export const getStoryInMarkdown = (scenes: Scene[]): string => {
  let segments: string[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const hasContent = scene.content && scene.content.trim() != "";

    if (hasContent) {
      const imageSegment = scene.imageUrl
        ? `![Description of image](${scene.imageUrl})`
        : "";
      segments.push(
        ...[`## Scene ${i + 1}\n\n`, scene.content!, imageSegment, "\n\n"]
      );
    }
  }

  return segments.join("");
};

export const convertMarkdownToHtml = (markdown: string) => {
  const md = new MarkdownIt();
  const html = md.render(markdown);
  return html;
};
