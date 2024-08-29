import Markdown from "react-markdown";
import { Scene } from "../common";

type SceneSetupViewerProps = {
  scene: Scene;
  onRequestNewSetup: () => void;
};

const SceneSetupViewer = ({
  scene,
  onRequestNewSetup,
}: SceneSetupViewerProps) => {
  return (
    <div className="w-full mx-0 p-4 dark:bg-gray-700 bg-gray-300 rounded-md font-sans text-md">
      <Markdown>{scene.setup}</Markdown>
      {!scene.isDone && (
        <button
          className="btn btn-sm btn-outline btn-primary"
          onClick={onRequestNewSetup}
        >
          Re-Generate
        </button>
      )}
    </div>
  );
};

export { SceneSetupViewer };
