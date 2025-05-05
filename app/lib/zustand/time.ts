import { create } from "zustand";

interface TimeState {
  getTime: () => number;
  setTimeFunction: (timeFunction: () => number) => void;
  getDeltaTime: () => number;
  setDeltaTimeFunction: (timeFunction: () => number) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  getTime: () => 0,
  setTimeFunction: (timeFunction) => set({ getTime: timeFunction }),
  getDeltaTime: () => 0,
  setDeltaTimeFunction: (timeFunction) => set({ getDeltaTime: timeFunction }),
}));
