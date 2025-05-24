import { create } from "zustand";

import { handleUUID } from "../utils";

interface LoopStoreState {
  loops: Map<
    string, //loop id: same for start and end node
    Map<
      string, //label
      string // handleId
    > //map of input handles, these must be displayed as start input and output handles, and end input and output handles
  >;
  addHandle: (loopId: string, label: string) => void;
  removeHandle: (loopId: string, label: string) => void;
  getHandles: (loopId: string) => Map<string, string>;
}

export const useLoopStore = create<LoopStoreState>((set) => ({
  loops: new Map(),
  addHandle: (loopId, label) =>
    set((state) => {
      if (!state.loops.has(loopId)) {
        state.loops.set(loopId, new Map());
      }

      if (state.loops.get(loopId)!.has(label)) return state;

      const newLoops = new Map(state.loops);
      newLoops.get(loopId)!.set(label, handleUUID());
      return { loops: newLoops };
    }),
  removeHandle: (loopId, label) =>
    set((state) => {
      if (!state.loops.has(loopId)) return state;

      const newLoops = new Map(state.loops);
      newLoops.get(loopId)!.delete(label);
      return { loops: newLoops };
    }),
  getHandles: (loopId) => {
    const loop = useLoopStore.getState().loops.get(loopId);
    if (!loop) return new Map();
    const handles = new Map<string, string>();
    loop.forEach((handleId, label) => {
      handles.set(label, handleId);
    });
    return handles;
  }
}));
