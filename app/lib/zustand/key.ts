import { create } from "zustand";

interface KeyState {
  isKeyDown: (key: string) => boolean;
  setKeyDownFunction: (keyFunction: (key: string) => boolean) => void;
  isKeyPressed: (key: string) => boolean;
  setKeyPressedFunction: (keyFunction: (key: string) => boolean) => void;
  isKeyReleased: (key: string) => boolean;
  setKeyReleasedFunction: (keyFunction: (key: string) => boolean) => void;
}

/**
 * This store allows us the make key events more flexible.
 * It allows us to set custom functions for key down, pressed, and released events.
 */
export const useKeyStore = create<KeyState>((set) => ({
  isKeyDown: () => false,
  setKeyDownFunction: (keyFunction) => set({ isKeyDown: keyFunction }),
  isKeyPressed: () => false,
  setKeyPressedFunction: (keyFunction) => set({ isKeyPressed: keyFunction }),
  isKeyReleased: () => false,
  setKeyReleasedFunction: (keyFunction) => set({ isKeyReleased: keyFunction }),
}));
