/*
 * Authors:
 *
 * Purpose:
 */
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
    // Prevent re-initialization
    if (initialized) return;
    initialized = true;
    // Set the canvas container reference
    set({ canvasContainer: container });

    // Function to update mouse position
    const updatePosition = (e: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      // Check if the mouse is within the bounds of the container
      if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
        get().setMousePosition({
          x,
          y,
          clientX: e.clientX,
          clientY: e.clientY,
        });
      } else {
        // If the mouse is outside the bounds, set position to null
        get().setMousePosition(null);
      }
    };

    // If the mouse leaves the container, set position to null
    const handleMouseLeave = () => {
      get().setMousePosition(null);
    };

    // Add event listeners to the container
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

  // Function to open the add menu
  openAddMenu: (x?: number, y?: number) => {
    const state = get();

    // Coordinates, the menu will open at
    let menuX: number;
    let menuY: number;

    if (x !== undefined && y !== undefined) {
      // If x and y are provided, use them
      menuX = x;
      menuY = y;
    } else if (state.mousePosition) {
      // If mouse position is available, use it
      menuX = state.mousePosition.clientX;
      menuY = state.mousePosition.clientY;
    } else if (state.lastMenuPosition) {
      // If mouse position is not available, use the last menu position
      menuX = state.lastMenuPosition.x;
      menuY = state.lastMenuPosition.y;
    } else if (state.canvasContainer) {
      // If no coordinates are available, use the center of the canvas container
      const bounds = state.canvasContainer.getBoundingClientRect();
      menuX = bounds.left + bounds.width / 2;
      menuY = bounds.top + bounds.height / 2;
    } else {
      console.warn(
        "Cannot open add menu: no coordinates available and canvas container not found"
      );
      return;
    }

    menuX = menuX > window.innerWidth - 274 ? window.innerWidth - 274 : menuX;
    menuY = menuY > window.innerHeight - 284 ? window.innerHeight - 284 : menuY;
    set({
      menuX,
      menuY,
      visible: true,
      lastMenuPosition: { x: menuX, y: menuY },
    });
  },

  closeAddMenu: () => set({ visible: false }),
}));

// Hook to initialize mouse tracking in a specific pane
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
