import { create } from "zustand";

interface TimeState {
  time: number;
  setTime: (time: number) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  time: 0,
  setTime: (time: number) => {
    time = Math.round(time * 1000) / 1000;
    return set({ time });
  },
}));
