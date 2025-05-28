import { create } from "zustand";

type AddNodeDropdownState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useAddNodeDropdownStore = create<AddNodeDropdownState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
