"use client";

import { useState } from "react";
import { Scene } from "./common";
import { generateSceneSetup } from "@/app/api/story";
import { EmptySetup } from "./components/EmptySetup";
import { StoryEditor } from "./components/StoryEditor";
import { StoryPreview } from "./components/StoryPreview";

export default function Page() {
  const [scenes, setScenes] = useState<Scene[]>([]);

  const generateSetup = async () => {
    const setup = await generateSceneSetup();
    setScenes([{ setup, isAutomated: false, isDone: false }]);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 h-screen overflow-y-auto relative">
        <div className="m-14">
          <Title />
          <EmptySetup
            shouldRender={scenes.length == 0}
            onGenerateSetup={generateSetup}
          />
          <StoryPreview shouldRender={scenes.length > 1} scenes={scenes} />
          <StoryEditor
            scenes={scenes}
            onUpdateScenes={(scenes) => setScenes([...scenes])}
          />
        </div>
      </div>
    </div>
  );
}

const Title = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Story</h1>
  </div>
);
