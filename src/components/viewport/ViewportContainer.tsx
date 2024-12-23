import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { useState, useEffect } from "react";
import { Object3D } from "three";
import MeasurementSystem from "./MeasurementSystem";
import DebugOverlay, { DebugStats } from "../debug/DebugOverlay";
import TransformControls, {
  TransformControlsPanel,
} from "../controls/TransformControls";
import BasicShape from "../objects/BasicShape";

const ViewportScene = () => {
  const debugStats = DebugStats();
  const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);

  useEffect(() => {
    // Update debug stats here if needed
  }, [debugStats]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6e6e6e"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
      />
      <MeasurementSystem gridSize={100} gridDivisions={20} />

      {/* Test Objects */}
      <BasicShape
        position={[0, 0.5, 0]}
        color="#ff0000"
        size={[1, 1, 1]}
        onSelect={setSelectedObject}
      />
      <BasicShape
        position={[2, 0.5, 2]}
        color="#00ff00"
        size={[1, 2, 1]}
        onSelect={setSelectedObject}
      />
      <BasicShape
        position={[-2, 0.5, -2]}
        color="#0000ff"
        size={[2, 1, 1]}
        onSelect={setSelectedObject}
      />

      {/* Transform Controls */}
      <TransformControls object={selectedObject} />
    </>
  );
};

const ViewportContainer = () => {
  const [activeView, setActiveView] = useState<"single" | "quad">("single");

  return (
    <div className="w-full h-full relative">
      <DebugOverlay />
      <TransformControlsPanel />
      {activeView === "single" ? (
        <div className="w-full h-full">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[10, 10, 10]} />
            <OrbitControls makeDefault />
            <ViewportScene />
          </Canvas>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
          {/* Top View */}
          <div className="w-full h-full">
            <Canvas shadows>
              <PerspectiveCamera
                makeDefault
                position={[0, 10, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <OrbitControls makeDefault />
              <ViewportScene />
            </Canvas>
          </div>
          {/* Front View */}
          <div className="w-full h-full">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[0, 0, 10]} />
              <OrbitControls makeDefault />
              <ViewportScene />
            </Canvas>
          </div>
          {/* Side View */}
          <div className="w-full h-full">
            <Canvas shadows>
              <PerspectiveCamera
                makeDefault
                position={[10, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
              />
              <OrbitControls makeDefault />
              <ViewportScene />
            </Canvas>
          </div>
          {/* Perspective View */}
          <div className="w-full h-full">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[10, 10, 10]} />
              <OrbitControls makeDefault />
              <ViewportScene />
            </Canvas>
          </div>
        </div>
      )}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() =>
          setActiveView((prev) => (prev === "single" ? "quad" : "single"))
        }
      >
        Toggle View
      </button>
    </div>
  );
};

export default ViewportContainer;
