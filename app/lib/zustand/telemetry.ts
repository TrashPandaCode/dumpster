import { create } from "zustand";
import { useGameStore } from "../zustand/game"
import type { LEVELS } from "../game/core/levels";

type LevelId = keyof typeof LEVELS;

type LevelLog = {
    level: LevelId;
    nodes: string[];
};

type TelemetryStore = {
    logs: LevelLog[];
    logNode: (node: string) => void;
    newLevel: (level: LevelId) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
    logs: [
        {
            level: useGameStore.getState().currentLevel,
            nodes: [],
        },
    ],
    logNode: (node: string) =>
        set((state) => {
            const logs = [...state.logs];
            const lastGroup = logs[logs.length - 1];
            if (lastGroup) {
                lastGroup.nodes.push(node);
            }
            return { logs };
        }),

    newLevel: (level: LevelId) => 
        set((state => {
            return{
                logs: [...state.logs, { level, nodes: [] }]
            };
        })),
}));