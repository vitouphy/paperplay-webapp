import { generateSceneSetup, generateScene } from "@/app/api/chat";
import { Scene } from "../common";
import Markdown from "react-markdown";
import { useState } from "react";
import { getEntireStory } from "../utils";
import * as uuid from "uuid";
import { generateSceneImage } from "../api/image";

type SceneProps = {
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
}: SceneProps) => {
  const [loading, setLoading] = useState(false);
  const [nextSetup, setNextSetup] = useState(
    "Goal: Write something here\nConstraints:\n- Write something here\n-"
  );

  if (!scene) return null;

  const modalId = uuid.v4() as string;
  const entireStory = getEntireStory(scenes, scene);

  const generateSetup = async () => {
    const setup = await generateSceneSetup(entireStory);
    scene.setup = setup;
    onUpdateScene(scene);
  };

  const generateStory = async () => {
    const story = await generateScene(scene.setup, entireStory);
    scene.content = story;
    onUpdateScene(scene);
  };

  return (
    <div>
      <div className="container mx-auto p-4 dark:bg-gray-700 bg-gray-300 rounded-md font-sans text-md">
        <Markdown>{scene.setup}</Markdown>
        {!scene.isDone && (
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={generateSetup}
          >
            Re-Generate
          </button>
        )}
      </div>
      <br />

      <div>
        {!scene.isDone && (
          <button
            className="btn btn-sm btn-outline btn-primary mb-2"
            onClick={generateStory}
          >
            Write with AI
          </button>
        )}
      </div>
      <div className=" w-full">
        <textarea
          value={scene.content}
          onChange={(e) => {
            scene.content = e.target.value;
            onUpdateScene(scene);
          }}
          readOnly={scene.isDone}
          placeholder="Type your message..."
          className="textarea flex-1 p-2 border rounded-md resize-none w-full"
          rows={12}
        />
      </div>
      {!scene.isDone && scene.content && scene.content?.trim() !== "" && (
        <button
          className="btn btn-primary btn-outline"
          onClick={() => {
            const modal = document.getElementById(modalId) as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Done
        </button>
      )}

      {scene.isDone && (
        <div>
          <button
            className="btn btn-primary btn-outline mb-2 mt-6"
            onClick={async () => {
              setLoading(true);
              const result = await generateSceneImage(scene?.content!);
              if (result) {
                scene.imageUrl = result;
                onUpdateScene(scene);
                setLoading(false);
              }
            }}
          >
            Generate Image{" "}
            <div>
              {loading && (
                <span className="loading loading-spinner loading-md bg-primary"></span>
              )}
            </div>
          </button>

          <img src={scene.imageUrl} />
        </div>
      )}

      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Setup for Next Scene</h3>
          <p className="py-4">
            Before proceed, please leave a setup for the next scene.
          </p>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={6}
            value={nextSetup}
            onChange={(e) => setNextSetup(e.target.value)}
          ></textarea>
          <button
            className="btn btn-primary btn-outline"
            onClick={() => {
              scene.isDone = true;
              onUpdateScene(scene);

              let newScene: Scene = {
                setup: nextSetup,
                isAutomated: true,
                isDone: false,
              };
              onAddScene(newScene);

              const modal = document.getElementById(
                modalId
              ) as HTMLDialogElement;
              modal.close();
            }}
          >
            Submit
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export { SceneComponent };
