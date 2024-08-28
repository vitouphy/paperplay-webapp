import { ChangeEvent } from "react";
import Image from "next/image";
import { Scene } from "../common";
import { getEntireStory } from "../utils";
import { GenerateImageButton } from "./GenerateImageButton";
import { SceneCompleteButton } from "./SceneCompleteButton";
import { GenerateStoryButton } from "./GenerateStoryButton";
import { SetupViewer } from "./SetupViewer";
import { useSetupGenerator } from "../hooks/useSetupGenerator";

type SceneComponentProps = {
  scene: Scene;
  onAddScene: (scene: Scene) => void;
  onUpdateScene: (scene: Scene) => void;
  scenes: Scene[];
};

const SceneComponent = ({
  scene,
  onAddScene,
  onUpdateScene,
  scenes,
}: SceneComponentProps) => {
  const { generateSetup } = useSetupGenerator();

  if (!scene) return null;

  const entireStory = getEntireStory(scenes, scene);
  const isSceneHasStory = scene.content?.trim() !== "";
  const shouldShowDoneButton = !scene.isDone && isSceneHasStory;

  const generateNewSetup = async () => {
    const setup = await generateSetup(entireStory);
    if (setup) {
      updateScene({ setup });
    } else {
      console.error("Failed to generate new setup. Please try again.");
    }
  };

  const updateScene = (updates: Partial<Scene>) => {
    onUpdateScene({ ...scene, ...updates });
  };

  const onStoryTextAreaUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateScene({ content: e.target.value });
  };

  const onSceneComplete = () => {
    updateScene({ isDone: true });
  };

  const onNewSetupAvailable = (setup: string) => {
    onAddScene({ setup, isAutomated: true, isDone: false });
  };

  const onImageGenerated = (imageUrl: string) => {
    updateScene({ imageUrl });
  };

  const onStoryGenerated = (story: string) => {
    updateScene({ content: story });
  };

  return (
    <div>
      <SetupViewer scene={scene} onRequestNewSetup={generateNewSetup} />
      <GenerateStoryButton
        setup={scene.setup}
        entireStory={entireStory}
        shouldRender={!scene.isDone}
        onStoryGenerated={onStoryGenerated}
      />
      <textarea
        value={scene.content ?? ""}
        onChange={onStoryTextAreaUpdated}
        readOnly={scene.isDone}
        placeholder="Type your message..."
        className="w-full p-2 border rounded-md resize-none mt-4"
        rows={12}
      />
      <SceneCompleteButton
        shouldRender={shouldShowDoneButton}
        onSceneComplete={onSceneComplete}
        onNewSetupAvailable={onNewSetupAvailable}
      />
      <GenerateImageButton
        shouldRender={scene.isDone}
        scene={scene}
        onImageGenerated={onImageGenerated}
      />
      {scene.imageUrl && (
        <Image
          className="rounded-lg max-w-screen-sm"
          src={scene.imageUrl}
          alt="Generated scene image"
          width={512}
          height={512}
          layout="responsive"
        />
      )}
    </div>
  );
};

export { SceneComponent };
