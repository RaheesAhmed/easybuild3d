import { useState, useEffect, createContext, useContext } from "react";
import { create } from "zustand";
import { Object3D } from "three";
import { useProperties } from "../panels/PropertiesPanel";

interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
  children?: ContextMenuItem[];
}

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  targetObject: Object3D | null;
  show: (
    position: { x: number; y: number },
    items: ContextMenuItem[],
    target?: Object3D
  ) => void;
  hide: () => void;
}

const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0 },
  items: [],
  targetObject: null,
  show: (position, items, target = null) =>
    set({ isOpen: true, position, items, targetObject: target }),
  hide: () => set({ isOpen: false, items: [], targetObject: null }),
}));

export const useContextMenu = () => {
  const contextMenu = useContextMenuStore();
  const { setSelectedObject } = useProperties();

  const showObjectMenu = (e: MouseEvent, object: Object3D) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      {
        label: "Select",
        icon: "mouse",
        action: () => setSelectedObject(object),
      },
      {
        label: "Focus",
        icon: "center_focus_strong",
        action: () => {
          // Implement camera focus
        },
      },
      { divider: true },
      {
        label: "Transform",
        icon: "transform",
        children: [
          {
            label: "Reset Position",
            icon: "location_searching",
            action: () => {
              object.position.set(0, 0, 0);
            },
          },
          {
            label: "Reset Rotation",
            icon: "rotate_left",
            action: () => {
              object.rotation.set(0, 0, 0);
            },
          },
          {
            label: "Reset Scale",
            icon: "aspect_ratio",
            action: () => {
              object.scale.set(1, 1, 1);
            },
          },
        ],
      },
      {
        label: "Duplicate",
        icon: "content_copy",
        action: () => {
          // Implement duplication
        },
      },
      { divider: true },
      {
        label: "Delete",
        icon: "delete",
        action: () => {
          object.removeFromParent();
          setSelectedObject(null);
        },
      },
    ];

    contextMenu.show({ x: e.clientX, y: e.clientY }, items, object);
  };

  return {
    ...contextMenu,
    showObjectMenu,
  };
};

const MenuItem: React.FC<{
  item: ContextMenuItem;
  closeMenu: () => void;
}> = ({ item, closeMenu }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  if (item.divider) {
    return <div className="border-t border-gray-600 my-1" />;
  }

  return (
    <div className="relative">
      <button
        className={`w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center justify-between ${
          item.disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (!item.children) {
            item.action();
            closeMenu();
          }
        }}
        onMouseEnter={() => setShowSubmenu(true)}
        onMouseLeave={() => setShowSubmenu(false)}
        disabled={item.disabled}
      >
        <span className="flex items-center">
          {item.icon && (
            <span className="material-icons text-sm mr-2">{item.icon}</span>
          )}
          {item.label}
        </span>
        {item.children && (
          <span className="material-icons text-sm">chevron_right</span>
        )}
      </button>

      {item.children && showSubmenu && (
        <div className="absolute left-full top-0 bg-gray-800 rounded shadow-lg py-1 min-w-[150px] ml-1">
          {item.children.map((child, index) => (
            <MenuItem key={index} item={child} closeMenu={closeMenu} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ContextMenu = () => {
  const { isOpen, position, items, hide } = useContextMenuStore();

  useEffect(() => {
    const handleClickOutside = () => hide();
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, hide]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-gray-800 rounded shadow-lg py-1 min-w-[150px] z-[100]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {items.map((item, index) => (
        <MenuItem key={index} item={item} closeMenu={hide} />
      ))}
    </div>
  );
};
