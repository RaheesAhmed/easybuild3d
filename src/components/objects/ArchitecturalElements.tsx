import { useRef } from "react";
import { Mesh, Shape, ExtrudeGeometry, Object3D } from "three";
import { useProperties, ObjectProperties } from "../panels/PropertiesPanel";

interface BaseProps {
  onContextMenu?: (e: MouseEvent, object: Object3D) => void;
}

interface WallProps extends BaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  windows?: Array<{
    width: number;
    height: number;
    position: [number, number];
  }>;
}

interface FloorProps extends BaseProps {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  color?: string;
}

interface WindowProps extends BaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  frameColor?: string;
}

export const Wall: React.FC<WallProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 4,
  height = 3,
  depth = 0.2,
  color = "#cccccc",
  windows = [],
  onContextMenu,
}) => {
  const meshRef = useRef<Mesh>(null);
  const { setSelectedObject } = useProperties();

  // Create wall shape with window cutouts
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(width, 0);
  shape.lineTo(width, height);
  shape.lineTo(0, height);
  shape.lineTo(0, 0);

  // Add window holes
  windows.forEach(({ width: wWidth, height: wHeight, position: [x, y] }) => {
    const hole = new Shape();
    hole.moveTo(x, y);
    hole.lineTo(x + wWidth, y);
    hole.lineTo(x + wWidth, y + wHeight);
    hole.lineTo(x, y + wHeight);
    hole.lineTo(x, y);
    shape.holes.push(hole);
  });

  const extrudeSettings = {
    steps: 1,
    depth,
    bevelEnabled: false,
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation as any}
      onClick={(e) => {
        e.stopPropagation();
        if (meshRef.current) {
          meshRef.current.userData.type = "wall";
          setSelectedObject(meshRef.current);
        }
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        if (meshRef.current && onContextMenu) {
          onContextMenu(e.nativeEvent, meshRef.current);
        }
      }}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const Floor: React.FC<FloorProps> = ({
  position = [0, 0, 0],
  width = 10,
  depth = 10,
  height = 0.1,
  color = "#999999",
  onContextMenu,
}) => {
  const meshRef = useRef<Mesh>(null);
  const { setSelectedObject } = useProperties();

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (meshRef.current) {
          meshRef.current.userData.type = "floor";
          setSelectedObject(meshRef.current);
        }
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        if (meshRef.current && onContextMenu) {
          onContextMenu(e.nativeEvent, meshRef.current);
        }
      }}
    >
      <boxGeometry args={[width, depth, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const Window: React.FC<WindowProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 1,
  height = 1.5,
  depth = 0.1,
  color = "#88ccff",
  frameColor = "#666666",
  onContextMenu,
}) => {
  const meshRef = useRef<Mesh>(null);
  const { setSelectedObject } = useProperties();

  return (
    <group
      position={position}
      rotation={rotation as any}
      onClick={(e) => {
        e.stopPropagation();
        if (meshRef.current) {
          meshRef.current.userData.type = "window";
          setSelectedObject(meshRef.current);
        }
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        if (meshRef.current && onContextMenu) {
          onContextMenu(e.nativeEvent, meshRef.current);
        }
      }}
    >
      {/* Window frame */}
      <mesh ref={meshRef}>
        <boxGeometry args={[width + 0.1, height + 0.1, depth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Window glass */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[width - 0.1, height - 0.1, depth - 0.02]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0}
        />
      </mesh>
    </group>
  );
};
