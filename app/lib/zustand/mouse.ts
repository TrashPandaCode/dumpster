/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This Zustand store manages and exposes dynamically set functions to retrieve the current mouse position from the game engine.
 */
import { type Vec2 } from "kaplay";
import { create } from "zustand";

interface MouseState {
  getMousePos: () => Vec2;
  setMousePosFunction: (mouseFunction: () => Vec2) => void;
}

/**
 * Unified mouse position management using Zustand.
 * This store allows us to set a custom function to retrieve the mouse position,
 */
export const useMouseStore = create<MouseState>((set) => ({
  getMousePos: () => ({ x: 0, y: 0 }) as Vec2,
  setMousePosFunction: (mouseFunction) => set({ getMousePos: mouseFunction }),
}));
