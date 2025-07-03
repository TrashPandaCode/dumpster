/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This function initializes multiple state stores with data for a specified game level to prepare the application state.
 */
import { type LevelId } from "../game/core/levels";
import { useFlowStore } from "../node-editor/node-store/flow-store";
import { useLoopStore } from "../node-editor/node-store/loop-store";
import { useNodeStore } from "../node-editor/node-store/node-store";
import { useDataStore } from "./data";
import { useGameStore } from "./game";

/**
 * Initializes all stores with the required level data.
 * @param level Name of the level to load.
 */
export const initStores = (level: LevelId) => {
  // initialize all stores with level data
  useGameStore.getState().init(level);
  useFlowStore.getState().init(level);
  useNodeStore.getState().init();
  useLoopStore.getState().init();
  useDataStore.getState().init(level);
};
