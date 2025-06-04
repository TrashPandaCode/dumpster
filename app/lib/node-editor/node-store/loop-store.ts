import { create } from "zustand";

import type { LEVELS } from "~/lib/game/core/levels";
import { handleUUID } from "../utils";

interface LoopStoreState {
  loops: Map<
    string, //loop id: same for start and end node
    Map<
      string, //label
      string // handleId
    > //map of input handles, these must be displayed as start input and output handles, and end input and output handles
  >;
  addHandle: (loopId: string, label: string) => string; // returns the new handleId
  removeHandle: (loopId: string, label: string) => void;
  getHandles: (loopId: string) => Map<string, string>;
  init: (level: keyof typeof LEVELS) => void;
  reset: () => void;
}

export const useLoopStore = create<LoopStoreState>((set, get) => ({
  loops: new Map(),
  addHandle: (loopId, label) => {
    const newHandleId = handleUUID();
    set((state) => {
      if (!state.loops.has(loopId)) {
        state.loops.set(loopId, new Map());
      }

      if (state.loops.get(loopId)!.has(label)) return state;

      const newLoops = new Map(state.loops);
      newLoops.get(loopId)!.set(label, newHandleId);
      return { loops: newLoops };
    });
    return newHandleId;
  },
  removeHandle: (loopId, label) =>
    set((state) => {
      if (!state.loops.has(loopId)) return state;

      const newLoops = new Map(state.loops);
      newLoops.get(loopId)!.delete(label);
      return { loops: newLoops };
    }),
  getHandles: (loopId) => {
    const loop = get().loops.get(loopId);
    if (!loop) return new Map();
    const handles = new Map<string, string>();
    loop.forEach((handleId, label) => {
      handles.set(label, handleId);
    });
    return handles;
  },
  init: () => set({ loops: new Map() }),
  reset: () => set({ loops: new Map() }),
}));
