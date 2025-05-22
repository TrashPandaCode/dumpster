import { create } from "zustand";

interface ToastState {
  open: boolean;
  title: string;
  description: string;
  triggerToast: (title: string, description: string) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  title: "",
  description: "",
  triggerToast: (title, description) => {
    set({ open: true, title, description });
    setTimeout(() => {
      set({ open: false });
    }, 3000);
  },
  closeToast: () => set({ open: false }),
}));
