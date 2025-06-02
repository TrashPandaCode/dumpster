import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import initGame from "~/lib/game/core/initGame";
import { loadLevel } from "~/lib/game/core/loadLevel";
import NodeEditor from "~/lib/node-editor/NodeEditor";
import type { Route } from "./+types/Game";

import "./game.css";

import LevelCompleteDialog from "~/lib/game/components/LevelCompleteDialog";
import LevelDialog from "~/lib/game/components/LevelDialog";
import { cleanupKaplay } from "~/lib/game/core/kaplayCtx";
import type { LEVELS } from "~/lib/game/core/levels";
import { globalKeyTracker } from "~/lib/game/utils/globalKeyTracker";
import { useFlowStore } from "~/lib/node-editor/node-store/flow-store";
import { useLoopStore } from "~/lib/node-editor/node-store/loop-store";
import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";

const Game = ({ params }: Route.ComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // load current level from params
  const level = params.id || "playground";

  const setCurrentLevel = useGameStore((state) => state.setCurrentLevel);
  const [levelDialogOpen, setLevelDialogOpen] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    globalKeyTracker.init();
    initGame(canvasRef.current);

    // load and set the game level
    setCurrentLevel(level as keyof typeof LEVELS); // we can cast confidently here since we know the params.id is a valid level id, because loading the level will fail if it is not
    loadLevel(level);

    return () => {
      cleanupKaplay();

      useGameStore.getState().reset();
      useFlowStore.getState().reset();
      useNodeStore.getState().reset();
      useLoopStore.getState().reset();

      setLevelDialogOpen(true);

      globalKeyTracker.cleanup();
    };
  }, [level]);

  return (
    <>
      <LevelDialog open={levelDialogOpen} onOpenChange={setLevelDialogOpen} />
      <LevelCompleteDialog />
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
