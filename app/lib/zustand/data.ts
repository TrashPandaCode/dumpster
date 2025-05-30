import { create } from "zustand";

import type { GameObject } from "../game/constants";
import type { ConnectionAccess } from "../game/core/levels";

export type GameObjectsData = Map<
  GameObject, // gameobject label
  Map<
    string, // handle display name and id
    {
      access: ConnectionAccess;
      value: number;
    }
  >
>;

interface DataState {
  gameObjects: GameObjectsData;
  setData: (gameObject: GameObject, label: string, value: number) => void;
  addHandle: (gameObject: GameObject, label: string) => void;
  removeHandle: (gameObject: GameObject, label: string) => void;
  reset: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  gameObjects: new Map(),
  setData: (gameObject, label, value) => {
    const gob = get().gameObjects.get(gameObject)!;
    const { access } = gob.get(label)!;
    gob.set(label, {
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
        .set(label, { access: "all", value: 0 });

      return { ...state, gameObjects: newGameObjectsMap };
    }),
  removeHandle: (gameObject, label) =>
    set((state) => {
      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap.get(gameObject)!.delete(label);

      return { ...state, gameObjects: newGameObjectsMap };
    }),
  reset: () => set({ gameObjects: new Map() }),
}));
