import { useEffect } from "react";
import { create } from "zustand";

type Position = {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
} | null;

type NodeAddMenuStore = {
  // Mouse tracking
  mousePosition: Position;
  setMousePosition: (position: Position) => void;
  initMouseTracking: (container: HTMLElement) => (() => void) | undefined;

  // Add menu
  menuX: number;
  menuY: number;
  visible: boolean;
  openAddMenu: (x?: number, y?: number) => void;
  closeAddMenu: () => void;
};

let initialized = false;

export const useNodeAddMenuStore = create<NodeAddMenuStore>((set, get) => ({
  // Mouse tracking state
  mousePosition: null,
  setMousePosition: (position) => set({ mousePosition: position }),

  initMouseTracking: (container: HTMLElement) => {
    if (initialized) return;
    initialized = true;

    const updatePosition = (e: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
        get().setMousePosition({
          x,
          y,
          clientX: e.clientX,
          clientY: e.clientY,
        });
      } else {
        get().setMousePosition(null);
      }
    };

    const handleMouseLeave = () => {
      get().setMousePosition(null);
    };

    container.addEventListener("mousemove", updatePosition);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", updatePosition);
      container.removeEventListener("mouseleave", handleMouseLeave);
      initialized = false;
      get().setMousePosition(null);
    };
  },

  // Add menu state
  menuX: 0,
  menuY: 0,
  visible: false,

  openAddMenu: (x?: number, y?: number) => {
    const state = get();

    // If no coordinates provided, use current mouse position
    if (x === undefined || y === undefined) {
      const mousePos = state.mousePosition;
      if (!mousePos) {
        console.warn(
          "Cannot open add menu: no coordinates provided and no mouse position available"
        );
        return;
      }
      x = mousePos.clientX;
      y = mousePos.clientY;
    }

    set({ menuX: x, menuY: y, visible: true });
  },

  closeAddMenu: () => set({ visible: false }),
}));

// Hook for mouse tracking
export function useMouseTrackingInPane(
  ref: React.RefObject<HTMLElement | null>
) {
  const initMouseTracking = useNodeAddMenuStore(
    (state) => state.initMouseTracking
  );

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = initMouseTracking(ref.current);
    return () => cleanup?.();
  }, [ref, initMouseTracking]);
}
