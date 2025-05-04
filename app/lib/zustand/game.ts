import { create } from "zustand";

interface GameState {
    isPaused: boolean;
    pause: () => void;
    play: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    isPaused: false,
    pause: () => set({ isPaused: true }),
    play: () => set({ isPaused: false }),
}));
