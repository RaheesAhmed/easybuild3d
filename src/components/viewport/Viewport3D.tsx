import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  PerspectiveCamera,
  OrthographicCamera,
  Environment,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useViewportStore } from "../../stores/viewportStore";
import Scene from "./Scene";

interface Viewport3DProps {
  mode: string;
  view: "perspective" | "top" | "front" | "right";
  shapes: Array<{
    type: string;
    id: string;
    position: [number, number, number];
  }>;
  onShapeRemove: (id: string) => void;
  selectionMode: "vertex" | "edge" | "face" | "object";
}

const CameraController = ({ view }: { view: Viewport3DProps["view"] }) => {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const {
    cameraPositions,
    setCameraPosition,
    targetPosition,
    setTargetPosition,
  } = useViewportStore();

  useEffect(() => {
    if (!controls.current) return;

    const updateOtherViews = () => {
      setCameraPosition(
        view,
        camera.position.toArray() as [number, number, number]
      );
      setTargetPosition(
        view,
        controls.current.target.toArray() as [number, number, number]
      );
    };

    controls.current.addEventListener("change", updateOtherViews);
    return () => {
      controls.current?.removeEventListener("change", updateOtherViews);
    };
  }, [view, camera, setCameraPosition, setTargetPosition]);

  useEffect(() => {
    if (!controls.current) return;

    // Update camera and target when other views change
    const currentPos = new THREE.Vector3(...cameraPositions[view]);
    const currentTarget = new THREE.Vector3(...targetPosition[view]);

    if (!camera.position.equals(currentPos)) {
      camera.position.copy(currentPos);
    }
    if (!controls.current.target.equals(currentTarget)) {
      controls.current.target.copy(currentTarget);
    }
  }, [view, camera, cameraPositions, targetPosition]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={20}
    />
  );
};

const ViewportCamera = ({ view }: { view: Viewport3DProps["view"] }) => {
  const isOrthographic = view !== "perspective";
  const position = (
    view === "perspective"
      ? [10, 10, 10]
      : view === "top"
      ? [0, 10, 0]
      : view === "front"
      ? [0, 0, 10]
      : [10, 0, 0]
  ) as [number, number, number];

  const cameraProps = {
    makeDefault: true,
    position,
  };

  return isOrthographic ? (
    <OrthographicCamera {...cameraProps} zoom={50} near={-100} far={100} />
  ) : (
    <PerspectiveCamera {...cameraProps} fov={50} near={0.1} far={1000} />
  );
};

const Viewport3D = ({
  mode,
  view,
  shapes,
  onShapeRemove,
  selectionMode,
}: Viewport3DProps) => {
  return (
    <Canvas shadows className="w-full h-full">
      <Suspense fallback={null}>
        {/* Camera Setup */}
        <ViewportCamera view={view} />
        <CameraController view={view} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Grid */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellThickness={1}
          cellColor="#6e6e6e"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          rotation={
            view === "front"
              ? [-Math.PI / 2, 0, 0]
              : view === "right"
              ? [0, 0, -Math.PI / 2]
              : undefined
          }
        />

        {/* Scene Content */}
        <Scene
          mode={mode}
          shapes={shapes}
          onShapeRemove={onShapeRemove}
          selectionMode={selectionMode}
        />

        {/* Viewport Helper */}
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Suspense>
    </Canvas>
  );
};

export default Viewport3D;
