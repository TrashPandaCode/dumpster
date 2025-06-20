import { create } from "zustand";

import {
  LEVELS,
  type ConnectionAccess,
  type LevelId,
} from "../game/core/levels";
import type { GameObject } from "../game/gameObjects";

export class HandleData {
  access: ConnectionAccess;
  value: number | (() => number);

  constructor(access: ConnectionAccess, value: number | (() => number)) {
    this.access = access;
    this.value = value;
  }

  getValue(): number {
    if (typeof this.value === "number") return this.value;
    else if (typeof this.value === "function") return this.value();
    else return 0;
  }

  setValue(value: number | (() => number)) {
    this.value = value;
  }
}

type ExtractLabels<T> = T extends {
  modifiableGameObjects: readonly {
    connections: readonly { label: infer L }[];
  }[];
}
  ? L extends string
    ? L
    : never
  : never;

type AllPossibleLabels = ExtractLabels<(typeof LEVELS)[keyof typeof LEVELS]>;

type ExtractLevelGameObjects<L extends LevelId> =
  (typeof LEVELS)[L]["modifiableGameObjects"][number]["id"];

// Fixed type to properly extract labels for specific game objects
type ExtractLevelLabels<
  L extends LevelId,
  G extends ExtractLevelGameObjects<L>,
> = Extract<
  (typeof LEVELS)[L]["modifiableGameObjects"][number],
  { id: G }
>["connections"][number]["label"];

export type GameObjectsData = Map<
  GameObject, // gameobject label
  Map<
    string, // handle display name and id
    HandleData
  >
>;

interface DataState {
  initData: boolean;
  gameObjects: GameObjectsData;
  setData: (
    gameObject: GameObject,
    label: string,
    value: number | (() => number)
  ) => void;
  getData: (gameObject: GameObject, label: string) => number;
  addHandle: (gameObject: GameObject, label: string) => void;
  removeHandle: (gameObject: GameObject, label: string) => void;
  init: (level: LevelId) => void;
  save: () => void;
  reset: (level: LevelId) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  initData: true,
  gameObjects: new Map(),
  setData: (gameObject, label, value) => {
    get().gameObjects.get(gameObject)!.get(label)!.setValue(value);
  },
  getData: (gameObject, label) => {
    return get().gameObjects.get(gameObject)!.get(label)!.getValue();
  },
  addHandle: (gameObject, label) =>
    set((state) => {
      if (state.gameObjects.get(gameObject)!.has(label)) return state;

      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap.get(gameObject)!.set(label, new HandleData("all", 0));

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
      gameObjects: [GameObject, [string, HandleData][]][];
    };

    const gameObjects: GameObjectsData = new Map();

    for (const [gobId, handles] of dataStoreData.gameObjects) {
      const handleMap = new Map();
      for (const [handle, data] of handles) {
        handleMap.set(handle, new HandleData(data.access, data.value));
      }
      gameObjects.set(gobId, handleMap);
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
              new HandleData(conn.access, 0),
            ])
          ),
        ])
      ),
    }),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createLevelDataHelpers<L extends LevelId>(level: L) {
  const store = useDataStore.getState();

  return {
    setData: <G extends ExtractLevelGameObjects<L>>(
      gameObject: G,
      label: ExtractLevelLabels<L, G>,
      value: number | (() => number)
    ) => {
      store.setData(
        gameObject as GameObject,
        label as AllPossibleLabels,
        value
      );
    },
    getData: <G extends ExtractLevelGameObjects<L>>(
      gameObject: G,
      label: ExtractLevelLabels<L, G>
    ): number => {
      return store.getData(
        gameObject as GameObject,
        label as AllPossibleLabels
      );
    },
    addHandle: (gameObject: ExtractLevelGameObjects<L>, label: string) => {
      store.addHandle(gameObject as GameObject, label);
    },
    removeHandle: <G extends ExtractLevelGameObjects<L>>(
      gameObject: G,
      label: ExtractLevelLabels<L, G>
    ) => {
      store.removeHandle(gameObject as GameObject, label as AllPossibleLabels);
    },
    initData: store.initData,
  };
}
