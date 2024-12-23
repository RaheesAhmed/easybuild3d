import { useEffect, useState } from "react";
import { Object3D, Mesh } from "three";
import { create } from "zustand";

interface ObjectProperties {
  name: string;
  type: "wall" | "floor" | "window" | "door" | "basic";
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  material: {
    color: string;
    opacity: number;
  };
}

interface PropertiesStore {
  selectedObject: Object3D | null;
  properties: ObjectProperties;
  setSelectedObject: (object: Object3D | null) => void;
  updateProperties: (props: Partial<ObjectProperties>) => void;
}

const defaultProperties: ObjectProperties = {
  name: "Object",
  type: "basic",
  dimensions: { width: 1, height: 1, depth: 1 },
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  material: { color: "#ffffff", opacity: 1 },
};

const usePropertiesStore = create<PropertiesStore>((set) => ({
  selectedObject: null,
  properties: defaultProperties,
  setSelectedObject: (object) => {
    if (!object) {
      set({ selectedObject: null, properties: defaultProperties });
      return;
    }

    const props: ObjectProperties = {
      name: object.name || "Object",
      type: (object.userData.type as ObjectProperties["type"]) || "basic",
      dimensions: {
        width: (object as Mesh).geometry?.parameters?.width || 1,
        height: (object as Mesh).geometry?.parameters?.height || 1,
        depth: (object as Mesh).geometry?.parameters?.depth || 1,
      },
      position: {
        x: object.position.x,
        y: object.position.y,
        z: object.position.z,
      },
      rotation: {
        x: object.rotation.x,
        y: object.rotation.y,
        z: object.rotation.z,
      },
      material: {
        color: (object as Mesh).material?.color?.getHexString() || "#ffffff",
        opacity: (object as Mesh).material?.opacity || 1,
      },
    };

    set({ selectedObject: object, properties: props });
  },
  updateProperties: (props) =>
    set((state) => {
      if (!state.selectedObject) return state;

      // Update the actual object
      if (props.position) {
        state.selectedObject.position.set(
          props.position.x ?? state.selectedObject.position.x,
          props.position.y ?? state.selectedObject.position.y,
          props.position.z ?? state.selectedObject.position.z
        );
      }

      if (props.rotation) {
        state.selectedObject.rotation.set(
          props.rotation.x ?? state.selectedObject.rotation.x,
          props.rotation.y ?? state.selectedObject.rotation.y,
          props.rotation.z ?? state.selectedObject.rotation.z
        );
      }

      if (props.dimensions && state.selectedObject instanceof Mesh) {
        // Update geometry if dimensions changed
        // This would need proper implementation based on the object type
      }

      if (props.material && state.selectedObject instanceof Mesh) {
        if (props.material.color) {
          (state.selectedObject.material as any).color.setStyle(
            props.material.color
          );
        }
        if (typeof props.material.opacity === "number") {
          (state.selectedObject.material as any).opacity =
            props.material.opacity;
        }
      }

      return {
        properties: {
          ...state.properties,
          ...props,
        },
      };
    }),
}));

export const PropertiesPanel = () => {
  const { properties, updateProperties } = usePropertiesStore();

  if (!properties) return null;

  return (
    <div className="fixed right-4 top-4 w-64 bg-black bg-opacity-50 text-white p-4 rounded z-50">
      <h2 className="text-lg font-bold mb-4">{properties.name}</h2>

      <div className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <div className="text-sm">{properties.type}</div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium mb-1">Dimensions</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs">Width</label>
              <input
                type="number"
                value={properties.dimensions.width}
                onChange={(e) =>
                  updateProperties({
                    dimensions: {
                      ...properties.dimensions,
                      width: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Height</label>
              <input
                type="number"
                value={properties.dimensions.height}
                onChange={(e) =>
                  updateProperties({
                    dimensions: {
                      ...properties.dimensions,
                      height: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Depth</label>
              <input
                type="number"
                value={properties.dimensions.depth}
                onChange={(e) =>
                  updateProperties({
                    dimensions: {
                      ...properties.dimensions,
                      depth: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs">X</label>
              <input
                type="number"
                value={properties.position.x}
                onChange={(e) =>
                  updateProperties({
                    position: {
                      ...properties.position,
                      x: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Y</label>
              <input
                type="number"
                value={properties.position.y}
                onChange={(e) =>
                  updateProperties({
                    position: {
                      ...properties.position,
                      y: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs">Z</label>
              <input
                type="number"
                value={properties.position.z}
                onChange={(e) =>
                  updateProperties({
                    position: {
                      ...properties.position,
                      z: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-medium mb-1">Material</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs">Color</label>
              <input
                type="color"
                value={`#${properties.material.color}`}
                onChange={(e) =>
                  updateProperties({
                    material: { ...properties.material, color: e.target.value },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs">Opacity</label>
              <input
                type="number"
                value={properties.material.opacity}
                onChange={(e) =>
                  updateProperties({
                    material: {
                      ...properties.material,
                      opacity: Math.max(
                        0,
                        Math.min(1, parseFloat(e.target.value))
                      ),
                    },
                  })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                step="0.1"
                min="0"
                max="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useProperties = usePropertiesStore;
export type { ObjectProperties };
