import { type Vec2 } from "kaplay";
import { create } from "zustand";

interface MouseState {
  getMousePos: () => Vec2;
  setMousePosFunction: (mouseFunction: () => Vec2) => void;
}

export const useMouseStore = create<MouseState>((set) => ({
  getMousePos: () => ({ x: 0, y: 0 }) as Vec2,
  setMousePosFunction: (mouseFunction) => set({ getMousePos: mouseFunction }),
}));
