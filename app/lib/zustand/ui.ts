import { create } from "zustand";

export const useUIStore = create<{
  openAddNodeDropdown: () => void;
  setOpenAddNodeDropdown: (fn: () => void) => void;
}>((set) => ({
  openAddNodeDropdown: () => {},
  setOpenAddNodeDropdown: (fn) => set({ openAddNodeDropdown: fn }),
}));
