import { useState } from "react";
import {
  FiMove,
  FiRotateCw,
  FiMaximize2,
  FiGrid,
  FiBox,
  FiLayers,
  FiScissors,
  FiTool,
  FiCopy,
  FiEdit2,
  FiMinimize2,
  FiSlash,
  FiCommand,
  FiBox as FiCube,
  FiCircle as FiVertex,
  FiMinus,
  FiSquare as FiFace,
  FiLayout,
  FiMaximize,
} from "react-icons/fi";
import Viewport3D from "./Viewport3D";

interface ViewportContainerProps {
  isSidebarOpen: boolean;
}

type SelectionMode = "vertex" | "edge" | "face" | "object";
type EditMode =
  | "select"
  | "cursor"
  | "move"
  | "rotate"
  | "scale"
  | "transform"
  | "annotate"
  | "measure"
  | "addCube"
  | "extrude"
  | "inset"
  | "bevel"
  | "loopCut"
  | "knife"
  | "polyBuild";

type ShapeType = "cube" | "sphere" | "cylinder" | "plane" | "torus";
type ViewType = "perspective" | "top" | "front" | "right";
type ViewLayout = "single" | "quad";

const ViewportContainer = ({ isSidebarOpen }: ViewportContainerProps) => {
  const [activeView, setActiveView] = useState<ViewType>("perspective");
  const [viewLayout, setViewLayout] = useState<ViewLayout>("single");
  const [maximizedView, setMaximizedView] = useState<ViewType | null>(null);
  const [activeMode, setActiveMode] = useState<EditMode>("select");
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("object");
  const [shapes, setShapes] = useState<
    Array<{ type: ShapeType; id: string; position: [number, number, number] }>
  >([]);

  const handleAddShape = (type: ShapeType) => {
    const newShape = {
      type,
      id: Math.random().toString(36).substr(2, 9),
      position: [0, type === "plane" ? 0 : 0.5, 0] as [number, number, number],
    };
    setShapes([...shapes, newShape]);
  };

  const toggleViewLayout = () => {
    setViewLayout(viewLayout === "single" ? "quad" : "single");
    setMaximizedView(null);
  };

  const handleMaximizeView = (view: ViewType) => {
    if (maximizedView === view) {
      setMaximizedView(null);
    } else {
      setMaximizedView(view);
      setViewLayout("single");
    }
  };

  const renderViewport = (view: ViewType, isMaximized: boolean = false) => (
    <div className="relative h-full w-full">
      <Viewport3D
        mode={activeMode}
        view={view}
        shapes={shapes}
        onShapeRemove={(id) => setShapes(shapes.filter((s) => s.id !== id))}
        selectionMode={selectionMode}
      />
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          className="p-1.5 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
          onClick={() => handleMaximizeView(view)}
          title={isMaximized ? "Restore" : "Maximize"}
        >
          <FiMaximize className="w-4 h-4" />
        </button>
        <div className="px-2 py-1 bg-gray-800 rounded text-sm font-medium">
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Left Toolbar */}
      <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2 space-y-2">
        {/* View Layout Toggle */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            viewLayout === "quad" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={toggleViewLayout}
          title="Toggle Quad View"
        >
          <FiLayout className="w-5 h-5" />
        </button>

        {/* Selection Mode Tools */}
        <div className="flex flex-col space-y-1 p-1 bg-gray-700 rounded-lg">
          <button
            className={`p-1.5 rounded transition-colors ${
              selectionMode === "vertex" ? "bg-blue-500" : "hover:bg-gray-600"
            }`}
            onClick={() => setSelectionMode("vertex")}
            title="Vertex Select (1)"
          >
            <FiVertex className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded transition-colors ${
              selectionMode === "edge" ? "bg-blue-500" : "hover:bg-gray-600"
            }`}
            onClick={() => setSelectionMode("edge")}
            title="Edge Select (2)"
          >
            <FiMinus className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded transition-colors ${
              selectionMode === "face" ? "bg-blue-500" : "hover:bg-gray-600"
            }`}
            onClick={() => setSelectionMode("face")}
            title="Face Select (3)"
          >
            <FiFace className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded transition-colors ${
              selectionMode === "object" ? "bg-blue-500" : "hover:bg-gray-600"
            }`}
            onClick={() => setSelectionMode("object")}
            title="Object Select (4)"
          >
            <FiBox className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Tools */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "select" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("select")}
          title="Select Box (B)"
        >
          <FiGrid className="w-5 h-5" />
        </button>

        {/* Transform Tools */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "move" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("move")}
          title="Move (G)"
        >
          <FiMove className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "rotate" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("rotate")}
          title="Rotate (R)"
        >
          <FiRotateCw className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "scale" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("scale")}
          title="Scale (S)"
        >
          <FiMaximize2 className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "transform" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("transform")}
          title="Transform"
        >
          <FiCommand className="w-5 h-5" />
        </button>

        {/* Utility Tools */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "annotate" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("annotate")}
          title="Annotate"
        >
          <FiEdit2 className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "measure" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("measure")}
          title="Measure"
        >
          <FiMinimize2 className="w-5 h-5" />
        </button>

        {/* Add Objects */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "addCube" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => handleAddShape("cube")}
          title="Add Cube"
        >
          <FiCube className="w-5 h-5" />
        </button>

        {/* Mesh Editing Tools */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "extrude" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("extrude")}
          title="Extrude Region (E)"
        >
          <FiCopy className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "inset" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("inset")}
          title="Inset Faces (I)"
        >
          <FiScissors className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "bevel" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("bevel")}
          title="Bevel"
        >
          <FiTool className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "loopCut" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("loopCut")}
          title="Loop Cut"
        >
          <FiSlash className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "knife" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("knife")}
          title="Knife"
        >
          <FiScissors className="w-5 h-5 rotate-90" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === "polyBuild" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveMode("polyBuild")}
          title="Poly Build"
        >
          <FiLayers className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {viewLayout === "single" ? (
          renderViewport(maximizedView || activeView, !!maximizedView)
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            {renderViewport("perspective")}
            {renderViewport("top")}
            {renderViewport("front")}
            {renderViewport("right")}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      {isSidebarOpen && (
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <FiBox className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Properties</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Transform
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-8 text-gray-400">X</span>
                    <input
                      type="number"
                      className="flex-1 bg-gray-600 rounded px-2 py-1"
                      defaultValue="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-gray-400">Y</span>
                    <input
                      type="number"
                      className="flex-1 bg-gray-600 rounded px-2 py-1"
                      defaultValue="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-gray-400">Z</span>
                    <input
                      type="number"
                      className="flex-1 bg-gray-600 rounded px-2 py-1"
                      defaultValue="0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Materials
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="w-12 h-12 bg-red-500 rounded cursor-pointer" />
                  <div className="w-12 h-12 bg-blue-500 rounded cursor-pointer" />
                  <div className="w-12 h-12 bg-green-500 rounded cursor-pointer" />
                  <div className="w-12 h-12 bg-yellow-500 rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewportContainer;
