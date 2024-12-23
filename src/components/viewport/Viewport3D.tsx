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
import { Suspense, useEffect, useState, useMemo } from "react";
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
  selectionMode: "vertex" | "edge" | "face" | "object";
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
  onSubElementClick?: (type: "vertex" | "edge" | "face", index: number) => void;
  selectionMode: "vertex" | "edge" | "face" | "object";
  isSelected?: boolean;
  selectedElements?: Set<number>;
}

// Helper component for showing vertices
const VertexPoints = ({
  geometry,
  color = "#00ff00",
  selectedIndices = new Set<number>(),
  onClick,
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  selectedIndices?: Set<number>;
  onClick?: (index: number) => void;
}) => {
  const vertices = geometry.attributes.position;
  return (
    <group>
      {[...Array(vertices.count)].map((_, i) => (
        <mesh
          key={i}
          position={[vertices.getX(i), vertices.getY(i), vertices.getZ(i)]}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(i);
          }}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial
            color={selectedIndices.has(i) ? "#ff0000" : color}
            transparent
            opacity={selectedIndices.has(i) ? 1 : 0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// Helper component for showing edges
const EdgeLines = ({
  geometry,
  color = "#ffff00",
  selectedIndices = new Set<number>(),
  onClick,
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  selectedIndices?: Set<number>;
  onClick?: (index: number) => void;
}) => {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  const positions = edges.attributes.position;

  return (
    <group>
      {[...Array(positions.count / 2)].map((_, i) => {
        const start = new THREE.Vector3(
          positions.getX(i * 2),
          positions.getY(i * 2),
          positions.getZ(i * 2)
        );
        const end = new THREE.Vector3(
          positions.getX(i * 2 + 1),
          positions.getY(i * 2 + 1),
          positions.getZ(i * 2 + 1)
        );
        const center = start.add(end).multiplyScalar(0.5);

        return (
          <group key={i}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={
                    new Float32Array([
                      positions.getX(i * 2),
                      positions.getY(i * 2),
                      positions.getZ(i * 2),
                      positions.getX(i * 2 + 1),
                      positions.getY(i * 2 + 1),
                      positions.getZ(i * 2 + 1),
                    ])
                  }
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={selectedIndices.has(i) ? "#ff0000" : color}
                linewidth={selectedIndices.has(i) ? 3 : 1}
              />
            </line>
            <mesh
              position={center}
              scale={0.1}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(i);
              }}
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial visible={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Add this helper function to map cube faces
const getCubeFaces = (geometry: THREE.BufferGeometry) => {
  const positions = geometry.attributes.position;
  const faces = [];
  // Cube faces are in this order: front, back, top, bottom, right, left
  const faceNormals = [
    new THREE.Vector3(0, 0, 1), // front
    new THREE.Vector3(0, 0, -1), // back
    new THREE.Vector3(0, 1, 0), // top
    new THREE.Vector3(0, -1, 0), // bottom
    new THREE.Vector3(1, 0, 0), // right
    new THREE.Vector3(-1, 0, 0), // left
  ];

  for (let i = 0; i < positions.count; i += 6) {
    // 6 vertices per face (2 triangles)
    const centerPoint = new THREE.Vector3();
    // Calculate center of face using all 6 vertices
    for (let j = 0; j < 6; j++) {
      centerPoint.add(
        new THREE.Vector3(
          positions.getX(i + j),
          positions.getY(i + j),
          positions.getZ(i + j)
        )
      );
    }
    centerPoint.divideScalar(6);
    faces.push({
      center: centerPoint,
      normal: faceNormals[Math.floor(i / 6)],
      vertices: Array(6)
        .fill(0)
        .map((_, j) => ({
          x: positions.getX(i + j),
          y: positions.getY(i + j),
          z: positions.getZ(i + j),
        })),
    });
  }
  return faces;
};

// Update the FaceHighlight component for cubes
const FaceHighlight = ({
  geometry,
  selectedIndices = new Set<number>(),
  onClick,
  isCube = false,
}: {
  geometry: THREE.BufferGeometry;
  selectedIndices?: Set<number>;
  onClick?: (index: number) => void;
  isCube?: boolean;
}) => {
  const faces = useMemo(() => {
    if (isCube) {
      return getCubeFaces(geometry);
    }

    const geo = geometry.clone();
    const positions = geo.attributes.position;
    const faces = [];

    for (let i = 0; i < positions.count; i += 3) {
      const face = new THREE.Vector3()
        .addVectors(
          new THREE.Vector3(
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
          ),
          new THREE.Vector3(
            positions.getX(i + 1),
            positions.getY(i + 1),
            positions.getZ(i + 1)
          )
        )
        .add(
          new THREE.Vector3(
            positions.getX(i + 2),
            positions.getY(i + 2),
            positions.getZ(i + 2)
          )
        )
        .multiplyScalar(1 / 3);

      faces.push({ center: face });
    }
    return faces;
  }, [geometry, isCube]);

  return (
    <group>
      {faces.map((face, i) => (
        <group key={i}>
          <mesh
            position={face.center}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(i);
            }}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={selectedIndices.has(i) ? "#ff0000" : "#00ff00"}
              transparent
              opacity={0.5}
            />
          </mesh>
          {selectedIndices.has(i) && isCube && (
            <mesh position={face.center}>
              <planeGeometry args={[0.9, 0.9]} />
              <meshBasicMaterial
                color="#ff0000"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// Basic shapes components with selection visualization
const Cube = ({
  position,
  onClick,
  onSubElementClick,
  selectionMode,
  isSelected,
  selectedElements = new Set(),
}: ShapeProps) => {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow onClick={onClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#4a9eff"
          opacity={selectionMode === "face" ? 0.8 : 1}
          transparent={selectionMode === "face"}
        />
      </mesh>
      {selectionMode === "vertex" && (
        <VertexPoints
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("vertex", index)}
        />
      )}
      {selectionMode === "edge" && (
        <EdgeLines
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("edge", index)}
        />
      )}
      {selectionMode === "face" && (
        <FaceHighlight
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("face", index)}
          isCube={true}
        />
      )}
    </group>
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
  const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow onClick={onClick}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#4a9eff"
          opacity={selectionMode === "face" ? 0.8 : 1}
          transparent={selectionMode === "face"}
        />
      </mesh>
      {selectionMode === "vertex" && (
        <VertexPoints
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("vertex", index)}
        />
      )}
      {selectionMode === "edge" && (
        <EdgeLines
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("edge", index)}
        />
      )}
      {selectionMode === "face" && (
        <FaceHighlight
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("face", index)}
        />
      )}
    </group>
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
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    []
  );

  return (
    <group position={position}>
      <mesh castShadow receiveShadow onClick={onClick}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial
          color="#4a9eff"
          opacity={selectionMode === "face" ? 0.8 : 1}
          transparent={selectionMode === "face"}
        />
      </mesh>
      {selectionMode === "vertex" && (
        <VertexPoints
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("vertex", index)}
        />
      )}
      {selectionMode === "edge" && (
        <EdgeLines
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("edge", index)}
        />
      )}
      {selectionMode === "face" && (
        <FaceHighlight
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("face", index)}
        />
      )}
    </group>
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
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onClick}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#4a9eff"
          side={THREE.DoubleSide}
          opacity={selectionMode === "face" ? 0.8 : 1}
          transparent={selectionMode === "face"}
        />
      </mesh>
      {selectionMode === "vertex" && (
        <VertexPoints
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("vertex", index)}
        />
      )}
      {selectionMode === "edge" && (
        <EdgeLines
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("edge", index)}
        />
      )}
      {selectionMode === "face" && (
        <FaceHighlight
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("face", index)}
        />
      )}
    </group>
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
  const geometry = useMemo(() => new THREE.TorusGeometry(0.3, 0.1, 16, 32), []);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow onClick={onClick}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial
          color="#4a9eff"
          opacity={selectionMode === "face" ? 0.8 : 1}
          transparent={selectionMode === "face"}
        />
      </mesh>
      {selectionMode === "vertex" && (
        <VertexPoints
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("vertex", index)}
        />
      )}
      {selectionMode === "edge" && (
        <EdgeLines
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("edge", index)}
        />
      )}
      {selectionMode === "face" && (
        <FaceHighlight
          geometry={geometry}
          selectedIndices={selectedElements}
          onClick={(index) => onSubElementClick?.("face", index)}
        />
      )}
    </group>
  );
};

// Update the extrudeFace function
const extrudeFace = (
  geometry: THREE.BufferGeometry,
  faceIndex: number,
  amount: number = 0.5,
  isCube = false
) => {
  const positions = geometry.attributes.position;
  const faces = isCube ? getCubeFaces(geometry) : [];
  const face = faces[faceIndex];

  if (!face) return geometry;

  // Create new positions array
  const newPositions = new Float32Array(positions.array);

  if (isCube) {
    // For cubes, we move all vertices of the selected face
    face.vertices.forEach((vertex, idx) => {
      const arrayIndex = faceIndex * 18 + idx * 3; // 18 values per face (6 vertices * 3 coordinates)
      newPositions[arrayIndex] += face.normal.x * amount;
      newPositions[arrayIndex + 1] += face.normal.y * amount;
      newPositions[arrayIndex + 2] += face.normal.z * amount;
    });
  } else {
    // Original extrude logic for other shapes
    const verticesPerFace = 3;
    const startIdx = faceIndex * verticesPerFace;

    const v1 = new THREE.Vector3(
      positions.getX(startIdx),
      positions.getY(startIdx),
      positions.getZ(startIdx)
    );
    const v2 = new THREE.Vector3(
      positions.getX(startIdx + 1),
      positions.getY(startIdx + 1),
      positions.getZ(startIdx + 1)
    );
    const v3 = new THREE.Vector3(
      positions.getX(startIdx + 2),
      positions.getY(startIdx + 2),
      positions.getZ(startIdx + 2)
    );

    const normal = new THREE.Vector3()
      .crossVectors(
        new THREE.Vector3().subVectors(v2, v1),
        new THREE.Vector3().subVectors(v3, v1)
      )
      .normalize();

    for (let i = 0; i < 3; i++) {
      const idx = startIdx + i;
      newPositions[idx * 3] += normal.x * amount;
      newPositions[idx * 3 + 1] += normal.y * amount;
      newPositions[idx * 3 + 2] += normal.z * amount;
    }
  }

  const newGeometry = new THREE.BufferGeometry();
  newGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(newPositions, 3)
  );
  return newGeometry;
};

// Scene component with editing capabilities
const Scene = ({
  mode,
  shapes,
  onShapeRemove,
  selectionMode,
}: {
  mode: Viewport3DProps["mode"];
  shapes: Viewport3DProps["shapes"];
  onShapeRemove: (id: string) => void;
  selectionMode: Viewport3DProps["selectionMode"];
}) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Mesh | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<number>>(
    new Set()
  );
  const [extrudeHandle, setExtrudeHandle] = useState<THREE.Object3D | null>(
    null
  );
  const { scene } = useThree();

  useEffect(() => {
    // Clear extrude handle when mode changes
    if (mode !== "extrude") {
      setExtrudeHandle(null);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        if (selectedShapeId && selectionMode === "object") {
          onShapeRemove(selectedShapeId);
          setSelectedObject(null);
          setSelectedShapeId(null);
        }
      }

      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          setSelectedElements(new Set());
          setExtrudeHandle(null);
          break;
        case "e":
          if (
            selectionMode === "face" &&
            selectedElements.size > 0 &&
            selectedObject
          ) {
            // Create extrude handle
            const handle = new THREE.Object3D();
            const geometry = selectedObject.geometry;
            const face = Array.from(selectedElements)[0]; // Get first selected face
            const positions = geometry.attributes.position;
            const verticesPerFace = 3;
            const startIdx = face * verticesPerFace;

            // Calculate face center
            const center = new THREE.Vector3();
            for (let i = 0; i < 3; i++) {
              center.add(
                new THREE.Vector3(
                  positions.getX(startIdx + i),
                  positions.getY(startIdx + i),
                  positions.getZ(startIdx + i)
                )
              );
            }
            center.divideScalar(3);

            handle.position.copy(center);
            setExtrudeHandle(handle);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedObject,
    selectedShapeId,
    onShapeRemove,
    selectionMode,
    selectedElements,
  ]);

  const handleShapeClick = (event: ThreeEvent<MouseEvent>, id: string) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      setSelectedObject(event.object);
      setSelectedShapeId(id);
      if (selectionMode !== "object") {
        setSelectedElements(new Set());
      }
      setExtrudeHandle(null);
    }
  };

  const handleSubElementClick = (
    type: "vertex" | "edge" | "face",
    index: number
  ) => {
    if (mode === "extrude" && type !== "face") return; // Only allow face selection in extrude mode

    const newSelection = new Set(selectedElements);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedElements(newSelection);
    setExtrudeHandle(null);
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
          onSubElementClick: handleSubElementClick,
          selectionMode,
          isSelected: shape.id === selectedShapeId,
          selectedElements: selectedElements,
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

      {/* Extrude Handle */}
      {extrudeHandle && mode === "extrude" && selectedObject && (
        <TransformControls
          object={extrudeHandle}
          mode="translate"
          space="local"
          size={0.7}
          onObjectChange={(e) => {
            if (selectedObject && selectedElements.size > 0 && e?.target) {
              const face = Array.from(selectedElements)[0];
              const isCube =
                selectedObject.geometry instanceof THREE.BoxGeometry;
              const length = e.target.position.length();

              if (length > 0) {
                // Only update if there's actual movement
                const newGeometry = extrudeFace(
                  selectedObject.geometry,
                  face,
                  length,
                  isCube
                );
                selectedObject.geometry.dispose();
                selectedObject.geometry = newGeometry;
                selectedObject.updateMatrix();
              }
            }
          }}
        />
      )}
    </>
  );
};

const Viewport3D = ({
  mode,
  view,
  shapes,
  onShapeRemove,
  selectionMode,
}: Viewport3DProps) => {
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
        <Scene
          mode={mode}
          shapes={shapes}
          onShapeRemove={onShapeRemove}
          selectionMode={selectionMode}
        />

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
