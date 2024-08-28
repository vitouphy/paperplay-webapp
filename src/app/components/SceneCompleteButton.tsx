import { useState } from "react";
import * as uuid from "uuid";

const SETUP_TEMPLATE =
  "**Goal**: Write something here\n\n**Constraints**:\n- Write something here\n-";

const SceneCompleteButton = ({
  shouldRender = true,
  onSceneComplete,
  onNewSetupAvailable,
}: {
  shouldRender: boolean;
  onSceneComplete: () => void;
  onNewSetupAvailable: (setup: string) => void;
}) => {
  const [nextSetup, setNextSetup] = useState(SETUP_TEMPLATE);
  const modalId = uuid.v4() as string;

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <button
        className="btn btn-primary btn-outline"
        onClick={() => {
          const modal = document.getElementById(modalId) as HTMLDialogElement;
          modal.showModal();
        }}
      >
        Complete & Continue
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
              onSceneComplete();
              onNewSetupAvailable(nextSetup);
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
};

export { SceneCompleteButton };
