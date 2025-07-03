/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This Zustand store manages and exposes dynamically set functions to retrieve the current time and delta time from the game engine.
 */
import { create } from "zustand";

interface TimeState {
  getTime: () => number;
  setTimeFunction: (timeFunction: () => number) => void;
  getDeltaTime: () => number;
  setDeltaTimeFunction: (timeFunction: () => number) => void;
}

/**
 * This store allows re-exports of the time functions from the game engine.
 */
export const useTimeStore = create<TimeState>((set) => ({
  getTime: () => 0,
  setTimeFunction: (timeFunction) => set({ getTime: timeFunction }),
  getDeltaTime: () => 0,
  setDeltaTimeFunction: (timeFunction) => set({ getDeltaTime: timeFunction }),
}));
