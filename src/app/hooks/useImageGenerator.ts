import { useState } from "react";
import { generateSceneImage } from "../api/image";
import { ImageModel } from "../common";

const useImageGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateImage = async (
    story: string,
    imageModel: ImageModel = ImageModel.DALLE_3
  ) => {
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateSceneImage(story, imageModel);
      return imageUrl;
    } catch (err) {
      console.error("Failed to generate image:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, generateImage };
};

export { useImageGenerator };
