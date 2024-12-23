import { useEffect, useState } from "react";
import { TransformControls as DreiTransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { create } from "zustand";

interface TransformState {
  mode: "translate" | "rotate" | "scale";
  snapValues: {
    translate: number;
    rotate: number;
    scale: number;
  };
  setMode: (mode: "translate" | "rotate" | "scale") => void;
  setSnapValues: (
    values: Partial<{ translate: number; rotate: number; scale: number }>
  ) => void;
}

const useTransformStore = create<TransformState>((set) => ({
  mode: "translate",
  snapValues: {
    translate: 1, // 1 unit
    rotate: Math.PI / 12, // 15 degrees
    scale: 0.1, // 0.1 unit
  },
  setMode: (mode) => set({ mode }),
  setSnapValues: (values) =>
    set((state) => ({
      snapValues: { ...state.snapValues, ...values },
    })),
}));

interface TransformControlsProps {
  object?: THREE.Object3D | null;
}

export const TransformControlsPanel = () => {
  const { mode, snapValues, setMode, setSnapValues } = useTransformStore();

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded z-50">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            mode === "translate" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setMode("translate")}
        >
          Move
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "rotate" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setMode("rotate")}
        >
          Rotate
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "scale" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setMode("scale")}
        >
          Scale
        </button>
      </div>
      <div className="space-y-2">
        <div>
          <label className="block text-sm">Translation Snap (units)</label>
          <input
            type="number"
            value={snapValues.translate}
            onChange={(e) =>
              setSnapValues({ translate: parseFloat(e.target.value) || 0 })
            }
            className="w-24 px-2 py-1 bg-gray-700 rounded"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm">Rotation Snap (degrees)</label>
          <input
            type="number"
            value={(snapValues.rotate * 180) / Math.PI}
            onChange={(e) =>
              setSnapValues({
                rotate: (parseFloat(e.target.value) * Math.PI) / 180 || 0,
              })
            }
            className="w-24 px-2 py-1 bg-gray-700 rounded"
            step="5"
          />
        </div>
        <div>
          <label className="block text-sm">Scale Snap</label>
          <input
            type="number"
            value={snapValues.scale}
            onChange={(e) =>
              setSnapValues({ scale: parseFloat(e.target.value) || 0 })
            }
            className="w-24 px-2 py-1 bg-gray-700 rounded"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};

const TransformControls: React.FC<TransformControlsProps> = ({ object }) => {
  const { mode, snapValues } = useTransformStore();
  const { camera } = useThree();
  const [isTransforming, setIsTransforming] = useState(false);

  if (!object) return null;

  return (
    <DreiTransformControls
      object={object}
      mode={mode}
      camera={camera}
      translationSnap={snapValues.translate}
      rotationSnap={snapValues.rotate}
      scaleSnap={snapValues.scale}
      onMouseDown={() => setIsTransforming(true)}
      onMouseUp={() => setIsTransforming(false)}
      onChange={() => {
        // Handle transform changes here if needed
      }}
    />
  );
};

export default TransformControls;
