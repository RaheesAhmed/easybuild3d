import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

interface MeasurementSystemProps {
  visible?: boolean;
  unit?: "meters" | "feet";
  gridSize?: number;
  gridDivisions?: number;
}

const MeasurementSystem = ({
  visible = true,
  unit = "meters",
  gridSize = 100,
  gridDivisions = 100,
}: MeasurementSystemProps) => {
  const { scene } = useThree();
  const measurementGroup = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!measurementGroup.current) return;

    // Clear previous measurements
    while (measurementGroup.current.children.length) {
      measurementGroup.current.remove(measurementGroup.current.children[0]);
    }

    // Create measurement lines
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    });

    // Create grid lines with measurements
    for (
      let i = -gridSize / 2;
      i <= gridSize / 2;
      i += gridSize / gridDivisions
    ) {
      // X axis measurements
      const xGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0, -gridSize / 2),
        new THREE.Vector3(i, 0, gridSize / 2),
      ]);
      const xLine = new THREE.Line(xGeometry, material);
      measurementGroup.current.add(xLine);

      // Z axis measurements
      const zGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-gridSize / 2, 0, i),
        new THREE.Vector3(gridSize / 2, 0, i),
      ]);
      const zLine = new THREE.Line(zGeometry, material);
      measurementGroup.current.add(zLine);
    }

    // Add measurement labels (this would be implemented with HTML overlays in a real application)
  }, [gridSize, gridDivisions]);

  if (!visible) return null;

  return <group ref={measurementGroup} />;
};

export default MeasurementSystem;
