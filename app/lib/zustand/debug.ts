import { create } from "zustand";

interface DebugState {
  xpos: number;
  ypos: number;
  setxpos: (xpos: number) => void;
  setypos: (ypos: number) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  xpos: 0,
  ypos: 0,
  setxpos: (xpos: number) => set({ xpos }),
  setypos: (ypos: number) => set({ ypos: ypos }),
}));
