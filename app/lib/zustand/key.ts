import { create } from "zustand";

interface KeyState {
  keysPressed: Record<string, boolean>;
  setKeyPressed: (key: string, value: boolean) => void;
}

export const useKeyStore = create<KeyState>((set) => ({
  keysPressed: {},
  setKeyPressed: (key, pressed) =>
    set((state) => ({
      keysPressed: { ...state.keysPressed, [key]: pressed },
    })),
}));
