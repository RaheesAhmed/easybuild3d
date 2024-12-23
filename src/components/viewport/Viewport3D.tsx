// @ts-nocheck
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  EditMode,
  SelectionMode,
  ShapeType,
  ViewType,
  CameraPreset,
} from "./types";

interface Viewport3DProps {
  mode: EditMode;
  view: ViewType;
  shapes: Array<{
    type: ShapeType;
    id: string;
    position: [number, number, number];
  }>;
  onShapeRemove: (id: string) => void;
  selectionMode: SelectionMode;
  cameraPreset: CameraPreset;
  isTransitioning: boolean;
  showOrbitIndicator: boolean;
}

const Viewport3D: React.FC<Viewport3DProps> = ({
  mode,
  view,
  shapes,
  onShapeRemove,
  selectionMode,
  cameraPreset,
  isTransitioning,
  showOrbitIndicator,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const orbitIndicatorRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.fromArray(cameraPreset.position);
    camera.up.fromArray(cameraPreset.up);
    camera.lookAt(new THREE.Vector3().fromArray(cameraPreset.target));
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.fromArray(cameraPreset.target);
    controlsRef.current = controls;

    // Setup grid
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Setup orbit indicator
    const orbitIndicator = createOrbitIndicator();
    scene.add(orbitIndicator);
    orbitIndicatorRef.current = orbitIndicator;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();

      if (orbitIndicatorRef.current && showOrbitIndicator) {
        orbitIndicatorRef.current.position.copy(controls.target);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle camera transitions
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startUp = camera.up.clone();

    const endPosition = new THREE.Vector3().fromArray(cameraPreset.position);
    const endTarget = new THREE.Vector3().fromArray(cameraPreset.target);
    const endUp = new THREE.Vector3().fromArray(cameraPreset.up);

    if (isTransitioning) {
      const duration = 1000; // 1 second
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easing = easeInOutCubic(progress);

        camera.position.lerpVectors(startPosition, endPosition, easing);
        controls.target.lerpVectors(startTarget, endTarget, easing);
        camera.up.lerpVectors(startUp, endUp, easing);
        camera.updateProjectionMatrix();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    } else {
      camera.position.copy(endPosition);
      controls.target.copy(endTarget);
      camera.up.copy(endUp);
      camera.updateProjectionMatrix();
    }
  }, [cameraPreset, isTransitioning]);

  // Handle orbit indicator visibility
  useEffect(() => {
    if (orbitIndicatorRef.current) {
      orbitIndicatorRef.current.visible = showOrbitIndicator;
    }
  }, [showOrbitIndicator]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current)
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

// Helper functions
const createOrbitIndicator = () => {
  const group = new THREE.Group();

  // Create axes
  const axisLength = 0.5;
  const axisWidth = 2;

  // X axis (red)
  const xGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(axisLength, 0, 0),
  ]);
  const xMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: axisWidth,
  });
  const xAxis = new THREE.Line(xGeometry, xMaterial);

  // Y axis (green)
  const yGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, axisLength, 0),
  ]);
  const yMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    linewidth: axisWidth,
  });
  const yAxis = new THREE.Line(yGeometry, yMaterial);

  // Z axis (blue)
  const zGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, axisLength),
  ]);
  const zMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: axisWidth,
  });
  const zAxis = new THREE.Line(zGeometry, zMaterial);

  // Center sphere
  const sphereGeometry = new THREE.SphereGeometry(0.05);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  group.add(xAxis, yAxis, zAxis, sphere);
  return group;
};

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export default Viewport3D;
