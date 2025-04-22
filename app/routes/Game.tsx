import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import initGame from "~/lib/game/core/initGame";

const Game = () => {
  return (
    <PanelGroup direction="horizontal">
      {/* autoSaveId="main-layout" */}
      <Panel id="game" minSize={25} order={1}>
        <canvas id="game" className="w-1/2"></canvas>
      </Panel>
      <PanelResizeHandle className="w-2 bg-blue-800" />
      <Panel id="nodes" minSize={25} order={2}>
        <div className="w-1/2">Test</div>
      </Panel>
    </PanelGroup>
  );
};

initGame();

export default Game;
