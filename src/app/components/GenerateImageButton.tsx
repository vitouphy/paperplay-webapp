import { Scene } from "../common";
import { useImageGenerator } from "../hooks/useImageGenerator";

type GenerateImageButtonProps = {
  scene: Scene;
  shouldRender: boolean;
  onImageGenerated: (imageUrl: string) => void;
};

const GenerateImageButton = ({
  scene,
  shouldRender,
  onImageGenerated,
}: GenerateImageButtonProps) => {
  const { loading, error, generateImage } = useImageGenerator();
  if (!shouldRender) {
    return null;
  }

  const onClickGenerateImage = async () => {
    const imageUrl = await generateImage(scene?.content!);
    if (imageUrl) {
      onImageGenerated(imageUrl);
    }
  };

  return (
    <>
      {error && <div className="text-red-500 mb-2">Error: {error.message}</div>}
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
    </>
  );
};

export { GenerateImageButton };
