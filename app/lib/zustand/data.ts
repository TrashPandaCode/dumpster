import { create } from "zustand";

type GameObjectsData = Map<
  string, // gameobject label
  Map<
    string, // handle display name
    {
      handleId: string;
      value: number;
    }
  >
>;

interface DataState {
  gameObjects: GameObjectsData;
  setData: (
    gameObject: string,
    label: string,
    handleId: string,
    value: number
  ) => void;
  addHandle: (gameObject: string, label: string, handleId: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
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
      if (state.gameObjects.get(gameObject)!.has(label)) return state;

      const newGameObjectsMap = new Map(state.gameObjects);
      newGameObjectsMap
        .get(gameObject)!
        .set(label, { handleId: handleId, value: 0 });

      return { ...state, gameObjects: newGameObjectsMap };
    }),
}));
