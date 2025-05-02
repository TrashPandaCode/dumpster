import { create } from "zustand";

interface DebugState {
  nodeData: Map<string, { handleId: string; value: number }>;
  gameData: Map<string, { handleId: string; value: number }>;
  setNodeData: (label: string, handleId: string, value: number) => void;
  transferData: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  nodeData: new Map(),
  gameData: new Map(),
  setNodeData: (label, handleId, value) =>
    set((state) => {
      state.nodeData.set(label, { handleId: handleId, value: value });
      return state;
    }),
  transferData: () =>
    set((state) => ({
      gameData: new Map(state.nodeData),
    })),
}));
