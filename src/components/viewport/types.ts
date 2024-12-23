export type SelectionMode = "vertex" | "edge" | "face" | "object";

export type EditMode =
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

export type ShapeType = "cube" | "sphere" | "cylinder" | "plane" | "torus";
export type ViewType = "perspective" | "top" | "front" | "right" | "isometric";
export type ViewLayout = "single" | "quad";

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  up: [number, number, number];
}

export interface ViewBookmark {
  id: string;
  name: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraUp: [number, number, number];
}
