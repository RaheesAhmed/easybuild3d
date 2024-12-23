import { useState } from "react";
import { create } from "zustand";

interface ToolState {
  activeTool:
    | "select"
    | "move"
    | "rotate"
    | "scale"
    | "wall"
    | "floor"
    | "window"
    | "door";
  setActiveTool: (tool: ToolState["activeTool"]) => void;
}

const useToolStore = create<ToolState>((set) => ({
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),
}));

interface ToolButtonProps {
  tool: ToolState["activeTool"];
  icon: string;
  label: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ tool, icon, label }) => {
  const { activeTool, setActiveTool } = useToolStore();

  return (
    <button
      className={`px-3 py-2 rounded flex flex-col items-center justify-center ${
        activeTool === tool
          ? "bg-blue-500 text-white"
          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
      }`}
      onClick={() => setActiveTool(tool)}
      title={label}
    >
      <span className="material-icons text-xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export const Toolbar = () => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-2 rounded-b-lg shadow-lg z-50">
      <div className="flex space-x-2">
        {/* Selection Tools */}
        <div className="flex space-x-1 border-r border-gray-600 pr-2">
          <ToolButton tool="select" icon="mouse" label="Select" />
          <ToolButton tool="move" icon="open_with" label="Move" />
          <ToolButton tool="rotate" icon="rotate_right" label="Rotate" />
          <ToolButton tool="scale" icon="transform" label="Scale" />
        </div>

        {/* Construction Tools */}
        <div className="flex space-x-1">
          <ToolButton tool="wall" icon="wall" label="Wall" />
          <ToolButton tool="floor" icon="grid_on" label="Floor" />
          <ToolButton tool="window" icon="window" label="Window" />
          <ToolButton tool="door" icon="door_front" label="Door" />
        </div>

        {/* File Operations */}
        <div className="flex space-x-1 border-l border-gray-600 pl-2">
          <div className="relative">
            <button
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
              onClick={() =>
                setShowDropdown(showDropdown === "file" ? null : "file")
              }
            >
              <span className="material-icons text-xl mr-1">folder</span>
              <span>File</span>
            </button>
            {showDropdown === "file" && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg py-1 min-w-[150px]">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">add</span>
                  New Project
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">
                    folder_open
                  </span>
                  Open
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">save</span>
                  Save
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">save_as</span>
                  Save As
                </button>
                <div className="border-t border-gray-600 my-1"></div>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">
                    file_download
                  </span>
                  Export
                </button>
              </div>
            )}
          </div>

          {/* View Options */}
          <div className="relative">
            <button
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
              onClick={() =>
                setShowDropdown(showDropdown === "view" ? null : "view")
              }
            >
              <span className="material-icons text-xl mr-1">visibility</span>
              <span>View</span>
            </button>
            {showDropdown === "view" && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg py-1 min-w-[150px]">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">grid_4x4</span>
                  Toggle Grid
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">
                    straighten
                  </span>
                  Toggle Measurements
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
                  <span className="material-icons text-sm mr-2">
                    view_in_ar
                  </span>
                  Toggle Shadows
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const useTools = useToolStore;
