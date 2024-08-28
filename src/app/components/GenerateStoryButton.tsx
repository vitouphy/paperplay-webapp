import { useGenerateStory } from "../hooks/useStoryGenerator";

type GenerateStoryButtonProps = {
  setup: string;
  entireStory: string;
  shouldRender: boolean;
  onStoryGenerated: (story: string) => void;
};

const GenerateStoryButton = ({
  setup,
  entireStory,
  shouldRender,
  onStoryGenerated,
}: GenerateStoryButtonProps) => {
  const { loading, error, generateStory } = useGenerateStory();
  if (!shouldRender) {
    return null;
  }

  const onClickGenerateStory = async () => {
    const story = await generateStory(setup, entireStory);
    if (story) {
      onStoryGenerated(story);
    }
  };
  return (
    <>
      {error && <div className="text-red-500 mb-2">Error: {error.message}</div>}
      <button
        className="btn btn-sm btn-outline btn-primary mt-4"
        onClick={onClickGenerateStory}
      >
        Write with AI
        {loading && (
          <span className="loading loading-spinner loading-sm ml-2"></span>
        )}
      </button>
    </>
  );
};

export { GenerateStoryButton };
