import { useState, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface BasicShapeProps {
  position?: [number, number, number];
  color?: string;
  size?: [number, number, number];
  onSelect?: (mesh: Mesh) => void;
}

const BasicShape: React.FC<BasicShapeProps> = ({
  position = [0, 0, 0],
  color = "#ff0000",
  size = [1, 1, 1],
  onSelect,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect && meshRef.current) {
          onSelect(meshRef.current);
        }
      }}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        opacity={isHovered ? 0.8 : 1}
        transparent
      />
    </mesh>
  );
};

export default BasicShape;
