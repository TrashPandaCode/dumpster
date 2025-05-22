import { create } from "zustand";

let timeoutId: ReturnType<typeof setTimeout> | null = null;

interface ToastState {
  open: boolean;
  title: string;
  description: string;
  triggerToast: (title: string, description: string) => void;
  closeToast: () => void;
  pauseClose: () => void;
  resumeClose: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  title: "",
  description: "",
  triggerToast: (title, description) => {
    set({ open: true, title, description });
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      set({ open: false });
    }, 3000);
  },
  closeToast: () => {
    if (timeoutId) clearTimeout(timeoutId);
    set({ open: false });
  },
  pauseClose: () => {
    if (timeoutId) clearTimeout(timeoutId);
  },
  resumeClose: () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      set({ open: false });
    }, 3000);
  },
}));
