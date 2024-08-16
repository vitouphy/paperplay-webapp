"use client";

import { useState } from "react";
import { Scene } from "./common";
import { SceneComponent } from "./components/Scene";
import { generateSceneSetup, generateScene } from "@/app/api/chat";
import { EmptySetup } from "./components/EmptySetup";
import {
  convertMarkdownToHtml,
  getEntireStory,
  getStoryInMarkdown,
} from "./utils";
import parse from "html-react-parser";

export default function Page() {
  const [activeSceneId, setActiveSceneId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);

  const shouldShowEmptySetup = scenes.length == 0;
  const shouldShowReadStoryArea = scenes.length > 1;

  const EmptySetupArea = (
    <EmptySetup
      onGenerateSetup={async () => {
        const setup = await generateSceneSetup();
        setScenes([{ setup, isAutomated: false, isDone: false }]);
      }}
    />
  );

  const StoryReaderArea = () => {
    const [story, setStory] = useState("");
    return (
      <div>
        <button
          className="btn btn-primary btn-outline mb-6"
          onClick={() => {
            const storyInMarkdown = getStoryInMarkdown(scenes);
            const storyInHtml = convertMarkdownToHtml(storyInMarkdown);
            setStory(storyInHtml);

            const modal = document.getElementById(
              "read_modal"
            ) as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Read
        </button>
        <dialog id="read_modal" className="modal">
          <div className="modal-box max-w-screen-lg px-14">
            <div className="export-container">{parse(story)}</div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    );
  };

  const LoadingBarArea = (
    <div className="pl-10">
      <span className="loading loading-dots loading-lg bg-primary"></span>
    </div>
  );

  const StoryWritingArea = (
    <div role="tablist" className="tabs tabs-bordered w-full">
      {scenes.map((scene, sceneIndex) => (
        <input
          type="radio"
          key={`radio-${sceneIndex}`}
          className="radio radio-primary"
          checked={sceneIndex == activeSceneId}
          onChange={() => setActiveSceneId(sceneIndex)}
        />
      ))}

      {scenes.map((scene, sceneIndex) => (
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
            onUpdateScene={(updatedScene) => {
              scenes[sceneIndex] = updatedScene;
              setScenes([...scenes]);
            }}
            onAddScene={async (newScene) => {
              setIsLoading(true);
              if (newScene.isAutomated) {
                const newAiScene = await generateNextSceneStoryWithAI(newScene);
                const newUserScene = await getNextSceneForUser([
                  ...scenes,
                  newScene,
                ]);
                setScenes([...scenes, newAiScene, newUserScene]);
                setIsLoading(false);
              }
            }}
          />
        </div>
      ))}
    </div>
  );

  const generateNextSceneStoryWithAI = async (nextScene: Scene) => {
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

  return (
    <div className="flex h-screen">
      <div className="flex-1 h-screen overflow-y-auto relative">
        <div className="m-14">
          <div>
            <h1 className="text-2xl font-bold mb-4">Story</h1>
          </div>
          {shouldShowEmptySetup && EmptySetupArea}
          {shouldShowReadStoryArea && <StoryReaderArea />}
          {StoryWritingArea}
          {isLoading && LoadingBarArea}
        </div>
      </div>
    </div>
  );
}
