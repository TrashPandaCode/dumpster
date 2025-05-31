import { create } from "zustand";

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
