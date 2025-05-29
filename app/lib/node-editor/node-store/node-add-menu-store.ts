import { create } from "zustand";

type NodeAddMenuStore = {
  x: number;
  y: number;
  visible: boolean;
  open: (x: number, y: number) => void;
  close: () => void;
};

export const useNodeAddMenuStore = create<NodeAddMenuStore>((set) => ({
  x: 0,
  y: 0,
  visible: false,
  open: (x, y) => set({ x, y, visible: true }),
  close: () => set({ visible: false }),
}));
