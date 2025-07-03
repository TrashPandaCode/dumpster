/*
 * Authors:
 *
 * Purpose:
 */
import type { Node } from "@xyflow/react";
import { create } from "zustand";

/**
 * Clipboard state interface for managing copied nodes and their last paste position.
 */
interface ClipboardState {
  copiedNodes: Node[];
  lastPastePosition: { x: number; y: number } | null;
  setCopiedNodes: (nodes: Node[]) => void;
  clearClipboard: () => void;
  hasCopiedNodes: () => boolean;
}

/**
 * Clipboard state management using Zustand.
 * This store manages copied nodes and their last paste position.
 * It provides methods to set copied nodes, clear the clipboard, and check if there are copied
 */
export const useClipboardStore = create<ClipboardState>((set, get) => ({
  copiedNodes: [],
  lastPastePosition: null,
  setCopiedNodes: (nodes: Node[]) => set({ copiedNodes: nodes }),
  clearClipboard: () => set({ copiedNodes: [] }),
  hasCopiedNodes: () => get().copiedNodes.length > 0,
}));
