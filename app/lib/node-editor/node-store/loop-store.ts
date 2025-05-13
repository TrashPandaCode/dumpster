import { type Connection, type Edge, type Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

interface LoopStoreState {
  loops: Map<
    string, //loop id: same for start and end node
    Map<
      string, //label
      string // handleId
    > //map of input handles, these must be displayed as start input and output handles, and end input and output handles
  >;
  addHandle: (loopId: string, label: string) => void;
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
      newLoops.get(loopId)!.set(label, uuidv4());
      return { loops: newLoops };
    }),
}));
