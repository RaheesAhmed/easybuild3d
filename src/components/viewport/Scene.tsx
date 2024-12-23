import { useThree, ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface SceneProps {
  mode: string;
  shapes: Array<{
    type: string;
    id: string;
    position: [number, number, number];
  }>;
  onShapeRemove: (id: string) => void;
  selectionMode: "vertex" | "edge" | "face" | "object";
}

interface ShapeProps {
  position: [number, number, number];
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onSubElementClick?: (type: "vertex" | "edge" | "face", index: number) => void;
  selectionMode: "vertex" | "edge" | "face" | "object";
  isSelected?: boolean;
  selectedElements?: Set<number>;
}

// Basic shapes components
const Cube = ({
  position,
  onClick,
  onSubElementClick,
  selectionMode,
  isSelected,
  selectedElements = new Set(),
}: ShapeProps) => {
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isSelected ? "#ff9f1c" : "#4a9eff"}
        opacity={selectionMode === "face" ? 0.8 : 1}
        transparent={selectionMode === "face"}
      />
    </mesh>
  );
};

const Sphere = ({
  position,
  onClick,
  onSubElementClick,
  selectionMode,
  isSelected,
  selectedElements = new Set(),
}: ShapeProps) => {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={isSelected ? "#ff9f1c" : "#4a9eff"}
        opacity={selectionMode === "face" ? 0.8 : 1}
        transparent={selectionMode === "face"}
      />
    </mesh>
  );
};

const Cylinder = ({
  position,
  onClick,
  onSubElementClick,
  selectionMode,
  isSelected,
  selectedElements = new Set(),
}: ShapeProps) => {
  return (
    <mesh position={position} onClick={onClick}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial
        color={isSelected ? "#ff9f1c" : "#4a9eff"}
        opacity={selectionMode === "face" ? 0.8 : 1}
        transparent={selectionMode === "face"}
      />
    </mesh>
  );
};

const Plane = ({
  position,
  onClick,
  onSubElementClick,
  selectionMode,
  isSelected,
  selectedElements = new Set(),
}: ShapeProps) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={isSelected ? "#ff9f1c" : "#4a9eff"}
        side={THREE.DoubleSide}
        opacity={selectionMode === "face" ? 0.8 : 1}
        transparent={selectionMode === "face"}
      />
    </mesh>
  );
};

const Torus = ({
  position,
  onClick,
  onSubElementClick,
  selectionMode,
  isSelected,
  selectedElements = new Set(),
}: ShapeProps) => {
  return (
    <mesh position={position} onClick={onClick}>
      <torusGeometry args={[0.3, 0.1, 16, 32]} />
      <meshStandardMaterial
        color={isSelected ? "#ff9f1c" : "#4a9eff"}
        opacity={selectionMode === "face" ? 0.8 : 1}
        transparent={selectionMode === "face"}
      />
    </mesh>
  );
};

const Scene = ({ mode, shapes, onShapeRemove, selectionMode }: SceneProps) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Mesh | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Delete" &&
        selectedShapeId &&
        selectionMode === "object"
      ) {
        onShapeRemove(selectedShapeId);
        setSelectedObject(null);
        setSelectedShapeId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapeId, onShapeRemove, selectionMode]);

  const handleShapeClick = (event: ThreeEvent<MouseEvent>, id: string) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      setSelectedObject(event.object);
      setSelectedShapeId(id);
      if (selectionMode !== "object") {
        setSelectedElements(new Set());
      }
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
          position: shape.position,
          onClick: (event: ThreeEvent<MouseEvent>) =>
            handleShapeClick(event, shape.id),
          selectionMode,
          isSelected: shape.id === selectedShapeId,
          selectedElements,
        };

        switch (shape.type) {
          case "cube":
            return <Cube key={shape.id} {...props} />;
          case "sphere":
            return <Sphere key={shape.id} {...props} />;
          case "cylinder":
            return <Cylinder key={shape.id} {...props} />;
          case "plane":
            return <Plane key={shape.id} {...props} />;
          case "torus":
            return <Torus key={shape.id} {...props} />;
        }
      })}

      {/* Transform Controls */}
      {selectedObject &&
        mode !== "select" &&
        mode !== "cursor" &&
        selectionMode === "object" && (
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
            space="world"
            size={0.7}
            onObjectChange={(e) => {
              if (selectedObject) {
                selectedObject.updateMatrix();
              }
            }}
          />
        )}
    </>
  );
};

export default Scene;
