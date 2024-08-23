import { generateSceneSetup, generateScene } from "@/app/api/story";
import { ImageModel, Scene } from "../common";
import Markdown from "react-markdown";
import { useState } from "react";
import { getEntireStory } from "../utils";
import * as uuid from "uuid";
import { generateSceneImage } from "../api/image";
import Image from "next/image";

const SETUP_TEMPLATE =
  "Goal: Write something here\nConstraints:\n- Write something here\n-";

const SceneComponent = ({
  scene,
  onAddScene,
  onUpdateScene,
  scenes,
}: SceneProps) => {
  const [loading, setLoading] = useState(false);
  const [nextSetup, setNextSetup] = useState(SETUP_TEMPLATE);

  if (!scene) return null;

  const modalId = uuid.v4() as string;
  const entireStory = getEntireStory(scenes, scene);
  const isSceneHasStory = scene.content && scene.content?.trim() !== "";
  const shouldShowDoneButton = !scene.isDone && isSceneHasStory;

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

  const SetupViewer = (
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
  );

  const WriteWithAIButton = (
    <button
      className="btn btn-sm btn-outline btn-primary mb-2"
      onClick={generateStory}
    >
      Write with AI
    </button>
  );

  const ShowDoneButton = (
    <>
      <button
        className="btn btn-primary btn-outline"
        onClick={() => {
          const modal = document.getElementById(modalId) as HTMLDialogElement;
          modal.showModal();
        }}
      >
        Done
      </button>
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
              onAddScene({
                setup: nextSetup,
                isAutomated: true,
                isDone: false,
              });

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
    </>
  );

  const ContentWritingArea = (
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
  );

  const GenerateImageButton = (
    <div>
      <button
        className="btn btn-primary btn-outline mb-2 mt-6"
        onClick={async () => {
          setLoading(true);
          scene.imageUrl = await generateSceneImage(
            scene?.content!,
            ImageModel.DALLE_3
          );
          onUpdateScene(scene);
          setLoading(false);
        }}
      >
        Generate Image{" "}
        <div>
          {loading && (
            <span className="loading loading-spinner loading-md bg-primary"></span>
          )}
        </div>
      </button>

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

  return (
    <div>
      {SetupViewer}
      <br />
      <div>{!scene.isDone && WriteWithAIButton}</div>
      {ContentWritingArea}
      {shouldShowDoneButton && ShowDoneButton}
      {scene.isDone && GenerateImageButton}
    </div>
  );
};

type SceneProps = {
  scene: Scene;
  onAddScene: (scene: Scene) => void;
  onUpdateScene: (scene: Scene) => void;
  scenes: Scene[];
};

export { SceneComponent };
