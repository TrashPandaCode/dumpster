import { create } from "zustand";

import type {
  ConnectionAccess,
  ModifiableGameObject,
} from "../game/core/levels";
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
  init: (modifiableGameObjects: ModifiableGameObject[]) => void;
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
  init: (modifiableGameObjects) =>
    set({
      initData: true,
      gameObjects: new Map(
        modifiableGameObjects.map((item) => [
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
