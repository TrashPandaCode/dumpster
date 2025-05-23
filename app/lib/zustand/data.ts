import { create } from "zustand";

import type { ConnectionAccess } from "../game/core/levels";
import { handleUUID } from "../node-editor/utils";

type GameObjectsData = Map<
  string, // gameobject label
  Map<
    string, // handle display name
    {
      handleId: string;
      access: ConnectionAccess;
      value: number;
    }
  >
>;

interface DataState {
  gameObjects: GameObjectsData;
  setData: (gameObject: string, label: string, value: number) => void;
  addHandle: (gameObject: string, label: string) => void;
  removeHandle: (gameObject: string, label: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  gameObjects: new Map(),
  setData: (gameObject, label, value) => {
    const gob = get().gameObjects.get(gameObject)!;
    const { access, handleId } = gob.get(label)!;
    gob.set(label, {
      handleId,
      access,
      value,
    });
  },
  addHandle: (gameObject, label) =>
    set((state) => {
      if (state.gameObjects.get(gameObject)!.has(label)) return state;

      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap
        .get(gameObject)!
        .set(label, { handleId: handleUUID(), access: "all", value: 0 });

      return { ...state, gameObjects: newGameObjectsMap };
    }),
  removeHandle: (gameObject, label) =>
    set((state) => {
      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap.get(gameObject)!.delete(label);

      return { ...state, gameObjects: newGameObjectsMap };
    }),
}));
