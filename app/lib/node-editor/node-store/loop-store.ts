/*
 * Authors: Jonathan Kron, Milan Jezovsek
 *
 * Purpose:
 * This file contains the store that handles all for loop data, including handles and serialization.
 */
import { create } from "zustand";

import { handleUUID } from "../utils/handles";

type LoopType = Map<
  string, //loop id: same for start and end node
  Map<
    string, //label
    string // handleId
  > //map of input handles, these must be displayed as start input and output handles, and end input and output handles
>;

interface LoopStoreState {
  loops: LoopType;
  addHandle: (loopId: string, label: string) => string; // returns the new handleId
  removeHandle: (loopId: string, label: string) => void;
  getHandles: (loopId: string) => Map<string, string>;
  init: () => void;
  save: () => void;
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
  init: () => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const stored = localStorage.getItem(`loop-store-${levelId}`);
    if (!stored) return get().reset();

    const loopStoreData = JSON.parse(stored) as {
      loops: [string, [string, string][]][];
    };
    const loops: LoopType = new Map();

    for (const [loopId, handles] of loopStoreData.loops) {
      loops.set(loopId, new Map(handles));
    }

    set({ loops });
  },
  save: () => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded

    const loopStoreData = {
      loops: [...get().loops.entries()].map(([loopId, handleMap]) => [
        loopId,
        [...handleMap.entries()],
      ]),
    };

    localStorage.setItem(
      `loop-store-${levelId}`,
      JSON.stringify(loopStoreData)
    );
  },
  reset: () => set({ loops: new Map() }),
}));
