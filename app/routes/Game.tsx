import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import initGame from "~/lib/game/core/initGame";
import NodeEditor from "~/lib/node-editor/NodeEditor";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    initGame(canvasRef.current);
  }, []);

  return (
    <PanelGroup direction="horizontal">
      {/* autoSaveId="main-layout" */}
      <Panel id="game-panel" minSize={25} order={1}>
        <canvas id="game-canvas" ref={canvasRef} className="w-1/2"></canvas>
      </Panel>
      <PanelResizeHandle className="flex w-2 items-center justify-center bg-slate-800">
        <DragHandleDots2Icon width={32} height={32} className="scale-125 text-slate-400" />
      </PanelResizeHandle>
      <Panel id="nodes-panel" minSize={25} order={2}>
        <NodeEditor />
      </Panel>
    </PanelGroup>
  );
};

export default Game;
