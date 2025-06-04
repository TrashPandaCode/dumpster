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
import { LEVELS } from "~/lib/game/core/levels";
import { globalKeyTracker } from "~/lib/game/utils/globalKeyTracker";
import { useFlowStore } from "~/lib/node-editor/node-store/flow-store";
import { useLoopStore } from "~/lib/node-editor/node-store/loop-store";
import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useDataStore } from "~/lib/zustand/data";

const Game = ({ params }: Route.ComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // load current level from params
  const level = (params.id || "calculator") as keyof typeof LEVELS; // default to "calculator" if no level is specified
  //TODO: navigate to /levels/calculator too. easy option: use navigate("/levels/calculator") in the useEffect below, nice option: handle in router directly

  const [levelDialogOpen, setLevelDialogOpen] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    globalKeyTracker.init(); // TODO: maybe move this into init game??
    initGame(canvasRef.current);

    // load the game level
    if (!(level in LEVELS)) {
      throw new Error(`Level ${level} not found`);
    }
    loadLevel(level);

    // register auto save interval
    const intervalId = setInterval(() => {
      useFlowStore.getState().save();
      useNodeStore.getState().save();
      useLoopStore.getState().save();
      useDataStore.getState().save();
    }, 1000);

    return () => {
      cleanupKaplay();
      clearInterval(intervalId);
      setLevelDialogOpen(true);
      globalKeyTracker.cleanup();
    };
  }, [level]);

  return (
    <>
      <div className="absolute top-0 left-0 z-10 h-full w-full bg-slate-900 p-8 text-center md:hidden">
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="text-2xl font-bold text-white">
            Please use a desktop browser to play the game.
          </h1>
        </div>
      </div>
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
