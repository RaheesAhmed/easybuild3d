import { FiGrid, FiMaximize2, FiMinimize2 } from "react-icons/fi";

interface ViewportControlsProps {
  isQuadView: boolean;
  setIsQuadView: (value: boolean) => void;
  maximizedView: "none" | "perspective" | "top" | "front" | "right";
  setMaximizedView: (
    view: "none" | "perspective" | "top" | "front" | "right"
  ) => void;
}

const ViewportControls = ({
  isQuadView,
  setIsQuadView,
  maximizedView,
  setMaximizedView,
}: ViewportControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setIsQuadView(!isQuadView)}
        className={`p-2 rounded transition-colors ${
          isQuadView ? "bg-blue-500" : "hover:bg-gray-700"
        }`}
        title={isQuadView ? "Single View" : "Quad View"}
      >
        <FiGrid className="w-5 h-5" />
      </button>
      {maximizedView === "none" ? (
        <button
          onClick={() => setMaximizedView("perspective")}
          className="p-2 rounded hover:bg-gray-700 transition-colors"
          title="Maximize"
        >
          <FiMaximize2 className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={() => setMaximizedView("none")}
          className="p-2 rounded hover:bg-gray-700 transition-colors"
          title="Restore"
        >
          <FiMinimize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ViewportControls;
