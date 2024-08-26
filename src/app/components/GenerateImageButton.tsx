import { useState } from "react";
import { generateSceneImage } from "../api/image";
import { Scene, ImageModel } from "../common";

const GenerateImageButton = ({
  scene,
  shouldRender,
  onImageGenerated,
}: {
  scene: Scene;
  shouldRender: boolean;
  onImageGenerated: (imageUrl: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  if (!shouldRender) {
    return null;
  }

  const onClickGenerateImage = async () => {
    setLoading(true);
    const imageUrl = await generateSceneImage(
      scene?.content!,
      ImageModel.DALLE_3
    );

    setLoading(false);
    onImageGenerated(imageUrl);
  };

  return (
    <button
      className="btn btn-primary btn-outline mb-2 mt-6"
      onClick={onClickGenerateImage}
    >
      Generate Image{" "}
      <div>
        {loading && (
          <span className="loading loading-spinner loading-md bg-primary"></span>
        )}
      </div>
    </button>
  );
};

export { GenerateImageButton };
