import { create } from "zustand";

import { LEVELS, type ConnectionAccess } from "../game/core/levels";
import type { GameObject } from "../game/gameObjects";

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
  initData: boolean;
  gameObjects: GameObjectsData;
  setData: (gameObject: GameObject, label: string, value: number) => void;
  addHandle: (gameObject: GameObject, label: string) => void;
  removeHandle: (gameObject: GameObject, label: string) => void;
  init: (level: keyof typeof LEVELS) => void;
  save: () => void;
  reset: (level: keyof typeof LEVELS) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  initData: true,
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
  init: (level) => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const stored = localStorage.getItem(`data-store-${levelId}`);
    if (!stored) return get().reset(level);

    const dataStoreData = JSON.parse(stored) as {
      initData: boolean;
      gameObjects: [
        GameObject,
        [string, { access: ConnectionAccess; value: number }][],
      ][];
    };

    const gameObjects = new Map<
      GameObject,
      Map<string, { access: ConnectionAccess; value: number }>
    >();

    for (const [gobId, handles] of dataStoreData.gameObjects) {
      gameObjects.set(gobId, new Map(handles));
    }

    set({
      initData: dataStoreData.initData,
      gameObjects,
    });
  },
  save: () => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const state = get();

    const dataStoreData = {
      initData: state.initData,
      gameObjects: [...state.gameObjects.entries()].map(
        ([gobLabel, handleMap]) => [gobLabel, [...handleMap.entries()]]
      ),
    };

    localStorage.setItem(
      `data-store-${levelId}`,
      JSON.stringify(dataStoreData)
    );
  },
  reset: (level) =>
    set({
      initData: true,
      gameObjects: new Map(
        LEVELS[level].modifiableGameObjects.map((item) => [
          item.id,
          new Map(
            item.connections.map((conn) => [
              conn.label,
              { access: conn.access, value: 0 },
            ])
          ),
        ])
      ),
    }),
}));
