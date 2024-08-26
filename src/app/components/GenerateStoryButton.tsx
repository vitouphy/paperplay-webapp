import { generateScene } from "../api/story";

const GenerateStoryButton = ({
  setup,
  entireStory,
  shouldRender,
  onStoryGenerated,
}: {
  setup: string;
  entireStory: string;
  shouldRender: boolean;
  onStoryGenerated: (story: string) => void;
}) => {
  if (!shouldRender) {
    return null;
  }

  const generateStory = async () => {
    const story = await generateScene(setup, entireStory);
    onStoryGenerated(story);
  };

  return (
    <button
      className="btn btn-sm btn-outline btn-primary mb-2"
      onClick={generateStory}
    >
      Write with AI
    </button>
  );
};

export { GenerateStoryButton };
