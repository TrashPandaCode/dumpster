import { create } from "zustand";
import { useGameStore } from "../zustand/game"
import type { LEVELS } from "../game/core/levels";

type LevelId = keyof typeof LEVELS;

type LevelLog = {
    level: LevelId;
    startTime: string;
    finishTime: string;
    skippedTutorial: boolean;
    nodes: string[];
};

type TelemetryStore = {
    logs: LevelLog[];
    logStart: (time: string) => void;
    logFinish: (time: string) => void;
    logNode: (node: string) => void;
    skippedTutorial: (bool: boolean) => void;
    newLevel: (level: LevelId) => void;
    downloadJSON: () => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
    logs: [
        {
            level: "playground",
            startTime: "0",
            finishTime: "0",
            skippedTutorial: false,
            nodes: [],
        },
    ],
    logStart: (time: string) =>
        set((state) => {
            const logs = [...state.logs];
            const lastGroup = logs[logs.length - 1];
            if (lastGroup && lastGroup.startTime == "0") {
                lastGroup.startTime = time;
            }
            return { logs };
        }),
    logFinish: (time: string) =>
        set((state) => {
            const logs = [...state.logs];
            const lastGroup = logs[logs.length - 1];
            if (lastGroup && lastGroup.finishTime == "0") {
                lastGroup.finishTime = time;
            }
            return { logs };
        }),
    logNode: (node: string) =>
        set((state) => {
            const logs = [...state.logs];
            const lastGroup = logs[logs.length - 1];
            if (lastGroup) {
                lastGroup.nodes.push(node);
            }
            console.log(logs);
            return { logs };
        }),
    skippedTutorial: (bool: boolean) =>
        set((state) => {
            const logs = [...state.logs];
            const lastGroup = logs[logs.length - 1];
            if (lastGroup) {
                lastGroup.skippedTutorial = bool;
            }
            console.log("skyped");
            return { logs };
        }),
    newLevel: (level: LevelId) => 
        set((state => {
            return{
                logs: [...state.logs, { level, startTime:"0", finishTime:"0", skippedTutorial:false, nodes: [] }]
            };
        })),
    downloadJSON: () =>
        set((state) => {
            const logs = [...state.logs];
            const jsonStr = JSON.stringify(logs, null, 2); // Pretty print with 2-space indentation
            const blob = new Blob([jsonStr], { type: "app/public/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "telemetry.JSON";
            link.click();

            URL.revokeObjectURL(url);
            return { logs };
        }),
}));