import { create } from "zustand";

import { IN_HANDLE_1, IN_HANDLE_2 } from "../node-editor/nodes/constants";

interface DebugState {
  gameObjects: Map<
    string, // gameobject label
    Map<
      string, // handle display name
      {
        handleId: string;
        value: number;
      }
    >
  >;
  setData: (
    gameObject: string,
    label: string,
    handleId: string,
    value: number
  ) => void;
  addHandle: (gameObject: string, label: string, handleId: string) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  gameObjects: new Map(),
  setData: (gameObject, label, handleId, value) =>
    set((state) => {
      state.gameObjects
        .get(gameObject)!
        .set(label, { handleId: handleId, value: value });
      return state;
    }),
  addHandle: (gameObject, label, handleId) =>
    set((state) => {
      if (state.gameObjects.get(gameObject)!.has(label)) return state; // this is just a fail safe, because we also test for this to happen in the export node

      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap
        .get(gameObject)!
        .set(label, { handleId: handleId, value: 0 });

      return { ...state, gameObjects: newGameObjectsMap };
    }),
}));
