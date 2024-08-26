import { generateSceneSetup } from "@/app/api/story";
import { Scene } from "../common";
import { ChangeEvent } from "react";
import { getEntireStory } from "../utils";

import Image from "next/image";
import { GenerateImageButton } from "./GenerateImageButton";
import { SceneCompleteButton } from "./SceneCompleteButton";
import { GenerateStoryButton } from "./GenerateStoryButton";
import { SetupViewer } from "./SetupViewer";

const SceneComponent = ({
  scene,
  onAddScene,
  onUpdateScene,
  scenes,
}: {
  scene: Scene;
  onAddScene: (scene: Scene) => void;
  onUpdateScene: (scene: Scene) => void;
  scenes: Scene[];
}) => {
  if (!scene) return null;

  const entireStory = getEntireStory(scenes, scene);
  const isSceneHasStory = scene.content != null && scene.content?.trim() !== "";
  const shouldShowDoneButton = !scene.isDone && isSceneHasStory;

  const generateNewSetup = async () => {
    const setup = await generateSceneSetup(entireStory);
    scene.setup = setup;
    onUpdateScene(scene);
  };

  const onStoryTextAreaUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    scene.content = e.target.value;
    onUpdateScene(scene);
  };

  const onSceneComplete = () => {
    scene.isDone = true;
    onUpdateScene(scene);
  };

  const onNewSetupAvailable = (setup: string) => {
    onAddScene({
      setup: setup,
      isAutomated: true,
      isDone: false,
    });
  };

  const onImageGenerated = (imageUrl: string) => {
    scene.imageUrl = imageUrl;
    onUpdateScene(scene);
  };

  const onStoryGenerated = async (story: string) => {
    scene.content = story;
    onUpdateScene(scene);
  };

  return (
    <div>
      <SetupViewer scene={scene} onRequestNewSetup={generateNewSetup} />
      <br />
      <GenerateStoryButton
        setup={scene.setup}
        entireStory={entireStory}
        shouldRender={!scene.isDone}
        onStoryGenerated={onStoryGenerated}
      />
      <div className="w-full">
        <textarea
          value={scene.content}
          onChange={onStoryTextAreaUpdated}
          readOnly={scene.isDone}
          placeholder="Type your message..."
          className="textarea flex-1 p-2 border rounded-md resize-none w-full"
          rows={12}
        />
      </div>
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
          src={scene.imageUrl!}
          alt={"Image"}
          width={512}
          height={512}
          layout="responsive"
        />
      )}
    </div>
  );
};

export { SceneComponent };
