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
  lastMenuPosition: { x: number; y: number } | null; // Neue Property für letzte Menüposition
  canvasContainer: HTMLElement | null; // Referenz zum Canvas Container
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
    set({ canvasContainer: container });

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
      set({ canvasContainer: null });
    };
  },

  // Add menu state
  menuX: 0,
  menuY: 0,
  visible: false,
  lastMenuPosition: null,
  canvasContainer: null,

  openAddMenu: (x?: number, y?: number) => {
    const state = get();

    let finalX: number;
    let finalY: number;

    if (x !== undefined && y !== undefined) {
      finalX = x;
      finalY = y;
    } else if (state.mousePosition) {
      finalX = state.mousePosition.clientX;
      finalY = state.mousePosition.clientY;
    } else if (state.lastMenuPosition) {
      finalX = state.lastMenuPosition.x;
      finalY = state.lastMenuPosition.y;
    } else if (state.canvasContainer) {
      const bounds = state.canvasContainer.getBoundingClientRect();
      finalX = bounds.left + bounds.width / 2;
      finalY = bounds.top + bounds.height / 2;
    } else {
      console.warn(
        "Cannot open add menu: no coordinates available and canvas container not found"
      );
      return;
    }

    set({
      menuX: finalX,
      menuY: finalY,
      visible: true,
      lastMenuPosition: { x: finalX, y: finalY },
    });
  },

  closeAddMenu: () => set({ visible: false }),
}));

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
