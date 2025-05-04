import { create } from "zustand";

import { IN_HANDLE_1, IN_HANDLE_2 } from "../node-editor/nodes/constants";

interface DebugState {
  nodeData: Map<string, { handleId: string; value: number }>;
  gameData: Map<string, { handleId: string; value: number }>;
  setNodeData: (label: string, handleId: string, value: number) => void;
  transferData: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  nodeData: new Map([
    ["xpos", { handleId: IN_HANDLE_1, value: 0 }],
    ["ypos", { handleId: IN_HANDLE_2, value: 0 }],
  ]), // this needs to be set level based
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
