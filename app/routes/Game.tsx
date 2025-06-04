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

const Game = ({ params }: Route.ComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // load current level from params
  const level = params.id || "calculator"; // default to "calculator" if no level is specified
  //TODO: navigate to /levels/calculator too. easy option: use navigate("/levels/calculator") in the useEffect below, nice option: handle in router directly

  const [levelDialogOpen, setLevelDialogOpen] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    globalKeyTracker.init(); // TODO: maybe move this into init game??
    initGame(canvasRef.current);

    // load the game level
    loadLevel(level as keyof typeof LEVELS);

    return () => {
      cleanupKaplay();

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
