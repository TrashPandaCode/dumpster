import { useEffect } from "react";
import { create } from "zustand";

type Position = {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
} | null;

type MouseStore = {
  position: Position;
  setPosition: (position: Position) => void;
  initTracking: (container: HTMLElement) => (() => void) | undefined;
};

let initialized = false;

export const useMouseStore = create<MouseStore>((set, get) => ({
  position: null,
  setPosition: (position) => set({ position }),

  initTracking: (container: HTMLElement) => {
    if (initialized) return;
    initialized = true;

    const updatePosition = (e: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
        get().setPosition({ x, y, clientX: e.clientX, clientY: e.clientY });
      } else {
        get().setPosition(null);
      }
    };

    const leave = () => {
      get().setPosition(null);
    };

    container.addEventListener("mousemove", updatePosition);
    container.addEventListener("mouseleave", leave);

    return () => {
      container.removeEventListener("mousemove", updatePosition);
      container.removeEventListener("mouseleave", leave);
      initialized = false;
      get().setPosition(null);
    };
  },
}));

export function useMouseTrackingInPane(
  ref: React.RefObject<HTMLElement | null>
) {
  const initTracking = useMouseStore((state) => state.initTracking);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = initTracking(ref.current);
    return () => cleanup?.();
  }, [ref, initTracking]);
}

type NodeAddMenuStore = {
  x: number;
  y: number;
  visible: boolean;
  openAddMenu: (x: number, y: number) => void;
  closeAddMenu: () => void;
};

export const useNodeAddMenuStore = create<NodeAddMenuStore>((set) => ({
  x: 0,
  y: 0,
  visible: false,
  openAddMenu: (x, y) => set({ x, y, visible: true }),
  closeAddMenu: () => set({ visible: false }),
}));
