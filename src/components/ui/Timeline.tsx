import { useState } from "react";
import { create } from "zustand";

interface TimelineState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  keyframes: {
    time: number;
    label: string;
    type: "camera" | "object" | "material";
  }[];
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addKeyframe: (keyframe: TimelineState["keyframes"][0]) => void;
  removeKeyframe: (time: number) => void;
}

const useTimelineStore = create<TimelineState>((set) => ({
  currentTime: 0,
  duration: 30, // 30 seconds
  isPlaying: false,
  keyframes: [],
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  addKeyframe: (keyframe) =>
    set((state) => ({
      keyframes: [...state.keyframes, keyframe].sort((a, b) => a.time - b.time),
    })),
  removeKeyframe: (time) =>
    set((state) => ({
      keyframes: state.keyframes.filter((k) => k.time !== time),
    })),
}));

export const Timeline = () => {
  const {
    currentTime,
    duration,
    isPlaying,
    keyframes,
    setCurrentTime,
    setIsPlaying,
  } = useTimelineStore();
  const [showKeyframeMenu, setShowKeyframeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowKeyframeMenu(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="flex items-center space-x-4">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded hover:bg-gray-700"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <span className="material-icons">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          <button className="p-2 rounded hover:bg-gray-700">
            <span className="material-icons">skip_previous</span>
          </button>
          <button className="p-2 rounded hover:bg-gray-700">
            <span className="material-icons">skip_next</span>
          </button>
        </div>

        {/* Time Display */}
        <div className="font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Timeline */}
        <div className="flex-1 relative">
          <div
            className="h-6 bg-gray-700 rounded cursor-pointer"
            onClick={handleTimelineClick}
            onContextMenu={handleContextMenu}
          >
            {/* Time Indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />

            {/* Keyframes */}
            {keyframes.map((keyframe, index) => (
              <div
                key={index}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer"
                style={{
                  left: `${(keyframe.time / duration) * 100}%`,
                  backgroundColor:
                    keyframe.type === "camera"
                      ? "#4CAF50"
                      : keyframe.type === "object"
                      ? "#2196F3"
                      : "#FF9800",
                }}
                title={keyframe.label}
              />
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded hover:bg-gray-700">
            <span className="material-icons">zoom_in</span>
          </button>
          <button className="p-2 rounded hover:bg-gray-700">
            <span className="material-icons">zoom_out</span>
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {showKeyframeMenu && (
        <div
          className="fixed bg-gray-800 rounded shadow-lg py-1 min-w-[150px]"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
            <span className="material-icons text-sm mr-2">add</span>
            Add Keyframe
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
            <span className="material-icons text-sm mr-2">delete</span>
            Delete Keyframe
          </button>
          <div className="border-t border-gray-600 my-1"></div>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center">
            <span className="material-icons text-sm mr-2">content_copy</span>
            Copy Time
          </button>
        </div>
      )}
    </div>
  );
};

export const useTimeline = useTimelineStore;
