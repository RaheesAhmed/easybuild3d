import { FiBox } from "react-icons/fi";

const LoadingScreen = () => {
  return (
    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-spin mb-4">
        <FiBox className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        EasyBuild3D
      </h2>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 animate-pulse rounded-full"
          style={{ width: "60%" }}
        ></div>
      </div>
      <p className="text-gray-400 mt-4">Loading 3D Environment...</p>
    </div>
  );
};

export default LoadingScreen;
