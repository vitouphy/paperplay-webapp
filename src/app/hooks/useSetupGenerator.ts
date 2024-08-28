import { useState } from "react";
import { generateSceneSetup } from "../api/story";

const useSetupGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateSetup = async (entireStory: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const setup = await generateSceneSetup(entireStory);
      return setup;
    } catch (err) {
      console.error("Failed to generate setup:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to generate setup")
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateSetup, isLoading, error };
};

export { useSetupGenerator };
