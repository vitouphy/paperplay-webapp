type EmtpySetupProps = {
  onGenerateSetup: () => void;
  shouldRender: boolean;
};

const EmptySetup = ({ onGenerateSetup, shouldRender }: EmtpySetupProps) => {
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-lg font-medium text-gray-600 mt-24">
        No setup found
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Generate a setup to get started
      </p>
      <button
        className="mt-4 btn btn-primary btn-outline text-white font-bold py-2 px-4 rounded"
        onClick={onGenerateSetup}
      >
        Generate
      </button>
    </div>
  );
};

export { EmptySetup };
