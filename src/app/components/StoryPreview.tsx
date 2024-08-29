import { useState } from "react";
import { Scene } from "../common";
import { getStoryInMarkdown, convertMarkdownToHtml } from "../utils";
import parse from "html-react-parser";
import { createCanvas, createPDF } from "../utils/pdfUtils";

type StoryPreviewProps = {
  shouldRender: boolean;
  scenes: Scene[];
};

const StoryPreview = ({ shouldRender, scenes }: StoryPreviewProps) => {
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

  const exportToPDF = async () => {
    const modal = document.getElementById("read_modal") as HTMLDialogElement;
    const modalContent = modal.querySelector(".modal-box") as HTMLElement;

    try {
      const { canvas } = await createCanvas(modalContent);
      const pdf = createPDF(canvas);
      pdf.save("story.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
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
          <button
            className="btn btn-warning btn-outline mt-4"
            onClick={exportToPDF}
          >
            Export as PDF
          </button>
          <div className="export-container">{parse(story)}</div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export { StoryPreview };
