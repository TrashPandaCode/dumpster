import { create } from "zustand";

interface DebugState {
  xpos: number;
  ypos: number;
  new_xpos: number;
  new_ypos: number;
  setxpos: (xpos: number) => void;
  setypos: (ypos: number) => void;
  setnew_xpos: (new_xpos: number) => void;
  setnew_ypos: (new_ypos: number) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  xpos: 0,
  ypos: 0,
  new_xpos: 0,
  new_ypos: 0,
  setxpos: (xpos: number) => set({ xpos }),
  setypos: (ypos: number) => set({ ypos }),
  setnew_xpos: (new_xpos: number) => set({ new_xpos }),
  setnew_ypos: (new_ypos: number) => set({ new_ypos }),
}));
