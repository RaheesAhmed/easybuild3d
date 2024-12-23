import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  PerspectiveCamera,
  Environment,
  TransformControls,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";

interface Viewport3DProps {
  mode:
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
  view: "perspective" | "top" | "front" | "right";
  shapes: Array<{
    type: "cube" | "sphere" | "cylinder" | "plane" | "torus";
    id: string;
    position: [number, number, number];
  }>;
  onShapeRemove: (id: string) => void;
}

interface ShapeProps {
  position: [number, number, number];
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}

// Basic shapes components
const Cube = ({ position, onClick }: ShapeProps) => (
  <mesh position={position} castShadow receiveShadow onClick={onClick}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#4a9eff" />
  </mesh>
);

const Sphere = ({ position, onClick }: ShapeProps) => (
  <mesh position={position} castShadow receiveShadow onClick={onClick}>
    <sphereGeometry args={[0.5, 32, 32]} />
    <meshStandardMaterial color="#4a9eff" />
  </mesh>
);

const Cylinder = ({ position, onClick }: ShapeProps) => (
  <mesh position={position} castShadow receiveShadow onClick={onClick}>
    <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
    <meshStandardMaterial color="#4a9eff" />
  </mesh>
);

const Plane = ({ position, onClick }: ShapeProps) => (
  <mesh
    position={position}
    rotation={[-Math.PI / 2, 0, 0]}
    receiveShadow
    onClick={onClick}
  >
    <planeGeometry args={[1, 1]} />
    <meshStandardMaterial color="#4a9eff" side={THREE.DoubleSide} />
  </mesh>
);

const Torus = ({ position, onClick }: ShapeProps) => (
  <mesh position={position} castShadow receiveShadow onClick={onClick}>
    <torusGeometry args={[0.3, 0.1, 16, 32]} />
    <meshStandardMaterial color="#4a9eff" />
  </mesh>
);

// Scene component with editing capabilities
const Scene = ({
  mode,
  shapes,
  onShapeRemove,
}: {
  mode: Viewport3DProps["mode"];
  shapes: Viewport3DProps["shapes"];
  onShapeRemove: (id: string) => void;
}) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Mesh | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const { scene, camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && selectedShapeId) {
        onShapeRemove(selectedShapeId);
        setSelectedObject(null);
        setSelectedShapeId(null);
      }

      // Handle keyboard shortcuts
      switch (event.key.toLowerCase()) {
        case "b":
          // Box select mode
          break;
        case "g":
          if (selectedObject) setSelectedObject(selectedObject);
          break;
        case "r":
          if (selectedObject) setSelectedObject(selectedObject);
          break;
        case "s":
          if (selectedObject) setSelectedObject(selectedObject);
          break;
        case "e":
          // Extrude mode
          break;
        case "i":
          // Inset faces mode
          break;
        case "k":
          // Knife mode
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObject, selectedShapeId, onShapeRemove]);

  const handleShapeClick = (event: ThreeEvent<MouseEvent>, id: string) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      setSelectedObject(event.object);
      setSelectedShapeId(id);
    }
  };

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Shapes */}
      {shapes.map((shape) => {
        const props = {
          key: shape.id,
          position: shape.position,
          onClick: (event: ThreeEvent<MouseEvent>) =>
            handleShapeClick(event, shape.id),
        };

        switch (shape.type) {
          case "cube":
            return <Cube {...props} />;
          case "sphere":
            return <Sphere {...props} />;
          case "cylinder":
            return <Cylinder {...props} />;
          case "plane":
            return <Plane {...props} />;
          case "torus":
            return <Torus {...props} />;
        }
      })}

      {/* Transform Controls */}
      {selectedObject && mode !== "select" && mode !== "cursor" && (
        <TransformControls
          object={selectedObject}
          mode={
            mode === "move" || mode === "transform"
              ? "translate"
              : mode === "rotate"
              ? "rotate"
              : mode === "scale"
              ? "scale"
              : undefined
          }
        />
      )}
    </>
  );
};

const Viewport3D = ({ mode, view, shapes, onShapeRemove }: Viewport3DProps) => {
  const cameraPositions: Record<typeof view, [number, number, number]> = {
    perspective: [10, 10, 10],
    top: [0, 20, 0],
    front: [0, 0, 10],
    right: [10, 0, 0],
  };

  return (
    <Canvas
      shadows
      className="w-full h-full"
      camera={{ position: cameraPositions[view], fov: 50 }}
    >
      <Suspense fallback={null}>
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
        />

        {/* Scene Content */}
        <Scene mode={mode} shapes={shapes} onShapeRemove={onShapeRemove} />

        {/* Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
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
