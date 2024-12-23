import { useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { create } from "zustand";

interface DebugStats {
  fps: number;
  triangles: number;
  drawCalls: number;
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
}

type DebugStore = {
  stats: DebugStats;
  updateStats: (newStats: Partial<DebugStats>) => void;
};

const useDebugStore = create<DebugStore>((set) => ({
  stats: {
    fps: 0,
    triangles: 0,
    drawCalls: 0,
    cameraPosition: { x: 0, y: 0, z: 0 },
  },
  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
}));

export const DebugStats = () => {
  const updateStats = useDebugStore((state) => state.updateStats);
  const { gl, camera } = useThree();

  useFrame((state, delta) => {
    const info = gl.info;
    updateStats({
      fps: Math.round(1 / delta),
      triangles: info.render.triangles,
      drawCalls: info.render.calls,
      cameraPosition: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
    });
  });

  return null;
};

const DebugOverlay: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const stats = useDebugStore((state) => state.stats);

  if (!showOverlay) return null;

  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-50 text-white p-4 font-mono text-sm z-50 pointer-events-auto">
      <div>FPS: {stats.fps}</div>
      <div>Triangles: {stats.triangles}</div>
      <div>Draw Calls: {stats.drawCalls}</div>
      <div>
        Camera Position:{" "}
        {`X: ${stats.cameraPosition.x.toFixed(2)}, 
         Y: ${stats.cameraPosition.y.toFixed(2)}, 
         Z: ${stats.cameraPosition.z.toFixed(2)}`}
      </div>
      <button
        className="mt-2 px-2 py-1 bg-blue-500 rounded"
        onClick={() => setShowOverlay(false)}
      >
        Hide Debug
      </button>
    </div>
  );
};

export default DebugOverlay;
