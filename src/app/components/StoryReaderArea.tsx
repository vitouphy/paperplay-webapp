import { useState } from "react";
import { Scene } from "../common";
import { getStoryInMarkdown, convertMarkdownToHtml } from "../utils";
import parse from "html-react-parser";

const StoryReaderArea = ({
  shouldRender,
  scenes,
}: {
  shouldRender: boolean;
  scenes: Scene[];
}) => {
  const [story, setStory] = useState("");

  if (!shouldRender) {
    return null;
  }

  const showStoryModal = () => {
    const storyInMarkdown = getStoryInMarkdown(scenes);
    const storyInHtml = convertMarkdownToHtml(storyInMarkdown);
    setStory(storyInHtml);

    const modal = document.getElementById("read_modal") as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <div>
      <button
        className="btn btn-primary btn-outline mb-6"
        onClick={showStoryModal}
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

export { StoryReaderArea };
