import { useState } from "react";
import { generateScene, generateSceneSetup } from "../api/story";
import { Scene } from "../common";
import { getEntireStory } from "../utils";
import { SceneComponent } from "./Scene";

type StoryWritingAreaProps = {
  scenes: Scene[];
  onUpdateScenes: (scenes: Scene[]) => void;
};

const StoryWritingArea = ({
  scenes,
  onUpdateScenes,
}: StoryWritingAreaProps) => {
  const [activeSceneId, setActiveSceneId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const updateActiveScene = (updatedScene: Scene) => {
    scenes[activeSceneId] = updatedScene;
    onUpdateScenes([...scenes]);
  };

  const addScene = async (newScene: Scene) => {
    setIsLoading(true);
    if (newScene.isAutomated) {
      const newAiScene = await generateNextSceneStoryWithAI(newScene, scenes);
      const newUserScene = await getNextSceneForUser([...scenes, newScene]);

      setIsLoading(false);
      onUpdateScenes([...scenes, newAiScene, newUserScene]);
    }
  };

  return (
    <>
      <div role="tablist" className="tabs tabs-bordered w-full">
        <RadioGroup
          scenes={scenes}
          activeSceneId={activeSceneId}
          onUpdateActiveSceneId={(newActiveSceneId) =>
            setActiveSceneId(newActiveSceneId)
          }
        />
        <SceneGroup
          scenes={scenes}
          activeSceneId={activeSceneId}
          onUpdateActiveScene={updateActiveScene}
          onAddScene={addScene}
        />
      </div>
      <LoadingBarArea shouldRender={isLoading} />
    </>
  );
};

const RadioGroup = ({
  scenes,
  activeSceneId,
  onUpdateActiveSceneId,
}: {
  scenes: Scene[];
  activeSceneId: number;
  onUpdateActiveSceneId: (activeSceneId: number) => void;
}) => {
  return (
    <div className="space-x-2 mb-4">
      {scenes.map((scene, sceneIndex) => (
        <input
          type="radio"
          key={`radio-${sceneIndex}`}
          className={`radio ${
            scene.isDone ? "radio-success" : "radio-primary"
          }`}
          checked={sceneIndex == activeSceneId}
          onChange={() => onUpdateActiveSceneId(sceneIndex)}
        />
      ))}
    </div>
  );
};

const SceneGroup = ({
  scenes,
  activeSceneId,
  onUpdateActiveScene,
  onAddScene,
}: {
  scenes: Scene[];
  activeSceneId: number;
  onUpdateActiveScene: (scene: Scene) => void;
  onAddScene: (scene: Scene) => void;
}) => {
  return scenes.map((scene, sceneIndex) => (
    <div
      role="tabpanel"
      className="tab-content p-10"
      key={`tab-content-${sceneIndex}`}
      style={{
        display: activeSceneId === sceneIndex ? "block" : "none",
      }}
    >
      <SceneComponent
        scene={scene}
        scenes={scenes}
        onUpdateScene={onUpdateActiveScene}
        onAddScene={onAddScene}
      />
    </div>
  ));
};

const LoadingBarArea = ({ shouldRender }: { shouldRender: boolean }) => {
  if (!shouldRender) {
    return null;
  }
  return (
    <div className="pl-10">
      <span className="loading loading-dots loading-lg bg-primary"></span>
    </div>
  );
};

const generateNextSceneStoryWithAI = async (
  nextScene: Scene,
  scenes: Scene[]
) => {
  const newSceneStory = await generateScene(
    nextScene.setup,
    getEntireStory(scenes)
  );
  nextScene.isAutomated = true;
  nextScene.content = newSceneStory;
  nextScene.isDone = true;
  return nextScene;
};

const getNextSceneForUser = async (scenes: Scene[]): Promise<Scene> => {
  const setup = await generateSceneSetup(getEntireStory(scenes));
  const newScene = {
    setup,
    isAutomated: false,
    isDone: false,
  };
  return newScene;
};

export { StoryWritingArea };
