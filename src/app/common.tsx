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

export type ImageCriticOutput = {
  output: string;
  reason: string;
  improvement: string;
  decision: number;
};
