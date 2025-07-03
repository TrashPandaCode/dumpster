/*
 * Authors: Jonathan Kron, Leo Kling
 *
 * Purpose:
 * This Zustand store manages the dynamic state of game objects and their connection handles,
 * providing methods to initialize, update, retrieve, add, remove, save, and reset handle data specific to each game level and gameobject.
 */
import { create } from "zustand";

import {
  LEVELS,
  type ConnectionAccess,
  type LevelId,
} from "../game/core/levels";
import type { GameObject } from "../game/game-objects";

/**
 * Represents a handle for a game object connection.
 * It contains the access type and a value that can be a number or a function returning a number.
 * The value can be set or retrieved, allowing for dynamic updates to the connection state.
 */
export class HandleData {
  access: ConnectionAccess;
  value: number | (() => number);

  constructor(access: ConnectionAccess, value: number | (() => number)) {
    this.access = access;
    this.value = value;
  }

  /**
   * Retrieves the value of the handle.
   * If the value is a number, it returns that number.
   * If the value is a function, it calls the function and returns its result.
   * If neither, it defaults to returning 0.
   */
  getValue(): number {
    if (typeof this.value === "number") return this.value;
    else if (typeof this.value === "function") return this.value();
    else return 0;
  }

  /**
   * Sets the value of the handle.
   * If the value is a number, it sets it directly.
   * If the value is a function, it sets the function as the value.
   */
  setValue(value: number | (() => number)) {
    this.value = value;
  }
}

/**
 * Extracts labels from the LEVELS object.
 */
type ExtractLabels<T> = T extends {
  modifiableGameObjects: readonly {
    connections: readonly { label: infer L }[];
  }[];
}
  ? L extends string
    ? L
    : never
  : never;

/**
 * Extracts all possible labels from the LEVELS object.
 * This type iterates over all levels and their modifiable game objects to gather all unique labels
 */
type AllPossibleLabels = ExtractLabels<(typeof LEVELS)[keyof typeof LEVELS]>;

/**
 * Extracts the game objects for a specific level.
 * This type iterates over the modifiable game objects of a given level and extracts their IDs
 * to create a union type of all game object IDs for that level.
 */
type ExtractLevelGameObjects<L extends LevelId> =
  (typeof LEVELS)[L]["modifiableGameObjects"][number]["id"];

/**
 * Fixed type to properly extract labels for specific game objects.
 * This type takes a level ID and a game object ID,
 * and extracts the labels of the handles for that game object
 * within the specified level.
 */
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

/**
 * Represents the state of the data store.
 * It includes initialization status, game objects data, and methods to manipulate the data.
 * - `initData`: Indicates if the data has been initialized.
 * - `gameObjects`: A map of game objects and their associated handles and values.
 * - `setData`: Method to set a value for a specific handle of a game object.
 * - `getData`: Method to retrieve the value of a specific handle of a game object.
 * - `addHandle`: Method to add a new handle to a game object.
 * - `removeHandle`: Method to remove a handle from a game object.
 * - `init`: Method to initialize the data store for a specific level.
 * - `save`: Method to save the current state of the data store to local storage.
 * - `reset`: Method to reset the data store for a specific level.
 */
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

/**
 * Creates a Zustand store for managing game data.
 * This store holds the state of game objects and their handles,
 * allowing for dynamic updates and retrieval of values.
 * It provides methods to set, get, add, and remove handles,
 * as well as to initialize, save, and reset the data store.
 */
export const useDataStore = create<DataState>((set, get) => ({
  initData: true,
  gameObjects: new Map(),
  setData: (gameObject, label, value) => {
    get().gameObjects.get(gameObject)?.get(label)?.setValue(value);
  },
  getData: (gameObject, label) => {
    return get().gameObjects.get(gameObject)?.get(label)?.getValue() ?? 0;
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

/**
 * Creates a set of helper functions for managing level data.
 * This function returns an object with methods to set, get, add, and remove data for specific game objects and labels.
 * It uses the Zustand store to access the current state and manipulate it accordingly.
 * @param level - The level ID for which to create the data helpers.
 * @returns An object with methods to manage level data.
 */
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
    initData: () => useDataStore.getState().initData,
  };
}
