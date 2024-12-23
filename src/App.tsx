import { Suspense, useState } from "react";
import ViewportContainer from "./components/viewport/ViewportContainer";
import { FiMenu, FiMaximize, FiSave, FiShare2 } from "react-icons/fi";
import LoadingScreen from "./components/ui/LoadingScreen";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            EasyBuild3D
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <FiSave className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
            <FiShare2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <FiMaximize className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        <Suspense fallback={<LoadingScreen />}>
          <ViewportContainer isSidebarOpen={isSidebarOpen} />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
