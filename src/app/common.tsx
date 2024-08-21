export type Scene = {
  setup: string;
  content?: string;
  imageUrl?: string;
  isAutomated: boolean;
  isDone: boolean;
};

export type Attempt = {
  imagePrompt: string;
  reason: string;
  improvement: string;
  imagePath: string;
};

export type ImageEvaluation = {
  output: string;
  reason: string;
  improvement: string;
  decision: number;
};

export enum ImageModel {
  DALLE_2,
  DALLE_3,
}
