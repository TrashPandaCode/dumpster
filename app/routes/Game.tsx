import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import initGame from "~/lib/game/core/initGame";
import { loadLevel } from "~/lib/game/core/loadLevel";
import NodeEditor from "~/lib/node-editor/NodeEditor";
import type { Route } from "./+types/Game";

import "./game.css";

import LevelDialog from "~/lib/game/components/LevelDialog";
import { cleanupKaplay } from "~/lib/game/core/kaplayCtx";
import type { LEVELS } from "~/lib/game/core/levels";
import { useGameStore } from "~/lib/zustand/game";
import { globalKeyTracker } from "~/lib/game/utils/globalKeyTracker";

import { useTelemetryStore } from "~/lib/zustand/telemetry"

const Game = ({ params }: Route.ComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // load current level from params
  // also set the current level in the game store
  const setCurrentLevel = useGameStore((state) => state.setCurrentLevel);
  const setTelemetryLevel = useTelemetryStore((state) => state.newLevel);
  const level = params.id || "playground";
  setCurrentLevel(level as keyof typeof LEVELS); // we can cast confidently here since we know the params.id is a valid level id, because loading the level will fail if it is not

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    globalKeyTracker.init();
    initGame(canvasRef.current);

    // load the game level
    loadLevel(level);
    setTelemetryLevel(level as keyof typeof LEVELS);

    return () => {
      cleanupKaplay();
      globalKeyTracker.cleanup();
    };
  }, []);

  return (
    <>
      <LevelDialog defaultOpen={true} />
      <PanelGroup direction="horizontal">
        {/* autoSaveId="main-layout" */}

        <Panel id="game-panel" minSize={25} order={1}>
          <canvas id="game-canvas" ref={canvasRef} className="w-1/2"></canvas>
        </Panel>
        <PanelResizeHandle className="flex w-2 items-center justify-center bg-slate-800">
          <DragHandleDots2Icon
            width={32}
            height={32}
            className="scale-125 text-slate-400"
          />
        </PanelResizeHandle>
        <Panel id="nodes-panel" minSize={25} order={2}>
          <NodeEditor />
        </Panel>
      </PanelGroup>
    </>
  );
};

export default Game;
