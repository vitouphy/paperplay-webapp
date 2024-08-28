import { useState } from "react";
import { generateScene } from "../api/story";

const useGenerateStory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateStory = async (setup: string, entireStory: string) => {
    setLoading(true);
    setError(null);
    try {
      const story = await generateScene(setup, entireStory);
      return story;
    } catch (err) {
      console.error("Failed to generate story:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, generateStory };
};

export { useGenerateStory };
