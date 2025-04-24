import { create } from "zustand";

interface DebugState {
  xpos: number;
  setxpos: (xpos: number) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  xpos: 0,
  setxpos: (xpos: number) => set({ xpos }),
}));
