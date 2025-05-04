import { create } from "zustand";

interface KeyState {
  isKeyDown: (key: string) => boolean;
  setKeyDownFunction: (keyFunction: (key: string) => boolean) => void;
  isKeyPressed: (key: string) => boolean;
  setKeyPressedFunction: (keyFunction: (key: string) => boolean) => void;
}

export const useKeyStore = create<KeyState>((set) => ({
  isKeyDown: () => false,
  setKeyDownFunction: (keyFunction) => set({ isKeyDown: keyFunction }),
  isKeyPressed: () => false,
  setKeyPressedFunction: (keyFunction) => set({ isKeyPressed: keyFunction }),
}));
