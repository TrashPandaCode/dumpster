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
  setHandles: (gameObject: string, label: string, handleId: string) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  gameObjects: new Map([
    [
      "bean",
      new Map([
        ["xpos", { handleId: IN_HANDLE_1, value: 0 }],
        ["ypos", { handleId: IN_HANDLE_2, value: 0 }],
      ]), // this needs to be set level based
    ],
  ]),
  setData: (gameObject, label, handleId, value) =>
    set((state) => {
      state.gameObjects
        .get(gameObject)!
        .set(label, { handleId: handleId, value: value });
      return state;
    }),
  setHandles: (gameObject, label, handleId) =>
    set((state) => {
      if (state.gameObjects.get(gameObject)!.has(label)) return state;

      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap
        .get(gameObject)!
        .set(label, { handleId: handleId, value: 0 });

      return { ...state, gameObjects: newGameObjectsMap };
    }),
}));
