import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import initGame from "~/lib/game/core/initGame";

const Game = () => {
  useEffect(() => {
    initGame();
  }, []);

  return (
    <PanelGroup direction="horizontal">
      {/* autoSaveId="main-layout" */}
      <Panel id="game-panel" minSize={25} order={1}>
        <canvas id="game-canvas" className="w-1/2"></canvas>
      </Panel>
      <PanelResizeHandle className="w-2 bg-blue-800" />
      <Panel id="nodes-panel" minSize={25} order={2}>
        <div className="w-1/2">Test</div>
      </Panel>
    </PanelGroup>
  );
};

export default Game;
