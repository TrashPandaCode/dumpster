import { create } from "zustand";

interface TimeState {
  time: number;
  deltaTime: number;
  setTime: (time: number) => void;
  setDeltaTime: (deltaTime: number) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  time: 0,
  deltaTime: 0,
  setTime: (time: number) => {
    time = Math.round(time * 1000) / 1000;
    return set({ time });
  },
  setDeltaTime: (deltaTime: number) => {
    return set({ deltaTime });
  },
}));
