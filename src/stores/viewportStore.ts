import { create } from "zustand";
import * as THREE from "three";

type ViewType = "perspective" | "top" | "front" | "right";
type Vector3Array = [number, number, number];

interface ViewportState {
  cameraPositions: Record<ViewType, Vector3Array>;
  targetPosition: Record<ViewType, Vector3Array>;
  setCameraPosition: (view: ViewType, position: Vector3Array) => void;
  setTargetPosition: (view: ViewType, position: Vector3Array) => void;
}

const defaultCameraPositions: Record<ViewType, Vector3Array> = {
  perspective: [10, 10, 10],
  top: [0, 10, 0],
  front: [0, 0, 10],
  right: [10, 0, 0],
};

const defaultTargetPosition: Record<ViewType, Vector3Array> = {
  perspective: [0, 0, 0],
  top: [0, 0, 0],
  front: [0, 0, 0],
  right: [0, 0, 0],
};

export const useViewportStore = create<ViewportState>()((set) => ({
  cameraPositions: { ...defaultCameraPositions },
  targetPosition: { ...defaultTargetPosition },
  setCameraPosition: (view: ViewType, position: Vector3Array) =>
    set((state: ViewportState) => ({
      cameraPositions: {
        ...state.cameraPositions,
        [view]: position,
      },
    })),
  setTargetPosition: (view: ViewType, position: Vector3Array) =>
    set((state: ViewportState) => ({
      targetPosition: {
        ...state.targetPosition,
        [view]: position,
      },
    })),
}));
