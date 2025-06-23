import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import initGame from "~/lib/game/core/init-game";
import { loadLevel } from "~/lib/game/core/load-level";
import NodeEditor from "~/lib/node-editor/NodeEditor";
import type { Route } from "./+types/Game";

import "./game.css";

import GoalsDialog from "~/lib/game/components/GoalsDialog";
import LevelCompleteDialog from "~/lib/game/components/LevelCompleteDialog";
import LevelDialog from "~/lib/game/components/LevelDialog";
import Tutorial from "~/lib/game/components/Tutorial";
import { cleanupKaplay } from "~/lib/game/core/kaplay-ctx";
import { LEVELS, type LevelId } from "~/lib/game/core/levels";
import { globalKeyTracker } from "~/lib/game/utils/global-keytracker";
import { useFlowStore } from "~/lib/node-editor/node-store/flow-store";
import { useLoopStore } from "~/lib/node-editor/node-store/loop-store";
import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useDataStore } from "~/lib/zustand/data";

import { useTelemetryStore } from "~/lib/zustand/telemetry"
const detectMac = (): boolean => {
  if (typeof navigator === "undefined") return false;

  // Method 1: Modern userAgentData API (Chrome 90+, Edge 91+)
  if ("userAgentData" in navigator && (navigator as any).userAgentData) {
    const uaData = (navigator as any).userAgentData;
    return uaData.platform === "macOS";
  }

  // Method 2: Check for Mac-specific properties
  if ("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0) {
    // Could be iOS/iPadOS, check userAgent
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Method 3: Fallback to userAgent parsing
  return /Mac/.test(navigator.userAgent);
};

const isMac = detectMac();

const Game = ({ params }: Route.ComponentProps) => {
  const setTelemetryLevel = useTelemetryStore((state) => state.newLevel);
  const downloadTelemetry = useTelemetryStore((state) => state.downloadJSON);
  const logStartTime = useTelemetryStore((state) => state.logStart);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // load current level from params
  const level = (params.id || "calculator") as LevelId; // default to "calculator" if no level is specified
  if (!(level in LEVELS)) {
    throw new Error(`Level ${level} not found`);
  }
  //TODO: navigate to /levels/calculator too. easy option: use navigate("/levels/calculator") in the useEffect below, nice option: handle in router directly

  const [tutorialOpen, setTutorialOpen] = useState(
    !JSON.parse(localStorage.getItem("hideTutorial") ?? "false")
  );
  const [levelDialogOpen, setLevelDialogOpen] = useState(!tutorialOpen);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    globalKeyTracker.init();
    initGame(canvasRef.current);
    loadLevel(level);

    // register auto save interval
    const intervalId = setInterval(() => {
      useFlowStore.getState().save();
      useNodeStore.getState().save();
      useLoopStore.getState().save();
      useDataStore.getState().save();
    }, 1000);
    
    setTelemetryLevel(level as keyof typeof LEVELS);
    logStartTime(new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }));

    // Wait for Ctrl+S
    const primaryModifier = isMac ? "Alt" : "Control";
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        console.log("${primaryModifier}+s");
        downloadTelemetry();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cleanupKaplay();
      clearInterval(intervalId);
      setLevelDialogOpen(true);
      globalKeyTracker.cleanup();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [level, downloadTelemetry]);

  return (
    <>
      <div className="absolute top-0 left-0 z-10 h-full w-full bg-slate-900 p-8 text-center md:hidden">
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="text-2xl font-bold text-white">
            Please use a desktop browser to play the game.
          </h1>
        </div>
      </div>
      {tutorialOpen && <Tutorial onClose={() => setTutorialOpen(false)} />}
      <LevelDialog
        open={!tutorialOpen && levelDialogOpen}
        onOpenChange={setLevelDialogOpen}
      />
      <GoalsDialog open={!tutorialOpen && !levelDialogOpen} />
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
