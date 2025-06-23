import { Background, ReactFlow, ReactFlowProvider, type ReactFlowInstance } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useRef, useEffect, useState } from "react";
import { Toaster } from "sonner";

import { useMouseTrackingInPane } from "../zustand/node-add-menu-store";
import { edgeTypes } from "./edges/edge-types";
import CenterPanel from "./editor-components/CenterPanel";
import LeftPanel from "./editor-components/LeftPanel";
import NodeContextMenu from "./editor-components/NodeContextMenu";
import PaneContextMenu from "./editor-components/PaneContextMenu";
import RightPanel from "./editor-components/RightPanel";
import SelectionContextMenu from "./editor-components/SelectionContextMenu";
import { TooltipProvider } from "./editor-components/Tooltip";
import { useContextMenu } from "./hooks/useContextMenu";
import { useFlow } from "./hooks/useFlow";
import { nodeTypes } from "./nodes/node-types";

import { useGameStore } from "../zustand/game";
import { useTelemetryStore } from "../zustand/telemetry";

const Editor = () => {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const logSolution = useTelemetryStore((state) => state.logSolution);
  const levelCompleted = useGameStore((state) => state.levelCompleted);
  const currentLevel = useGameStore.getState().currentLevel;
  const flowStore = localStorage.getItem(
    `flow-store-${currentLevel}`
  );
  const nodeStore = localStorage.getItem(
    `node-store-${currentLevel}`
  );
  const loopStore = localStorage.getItem(
    `loop-store-${currentLevel}`
  );
  const dataStore = localStorage.getItem(
    `data-store-${currentLevel}`
  );

  useEffect(() => {
    if(levelCompleted){
      logSolution(JSON.stringify({
        flowStore,
        nodeStore,
        loopStore,
        dataStore,
      }));
    };
  }, [levelCompleted, rfInstance]);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onBeforeDelete,
  } = useFlow();

  const {
    nodeContextMenu,
    selectionContextMenu,
    shouldShowPaneContextMenu,
    paneContextMenuX,
    paneContextMenuY,
    handlePaneContextMenu,
    handleNodeContextMenu,
    handleSelectionContextMenu,
    onPaneClick,
    setNodeContextMenu,
    setSelectionContextMenu,
    handleCloseCombinedMenu,
    nodeContextMenuRef,
    selectionContextMenuRef,
    paneContextMenuRef,
  } = useContextMenu();

  const containerRef = useRef<HTMLDivElement>(null);
  useMouseTrackingInPane(containerRef);

  return (
    <>
      <ReactFlow
        id="node-editor"
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeContextMenu={handleNodeContextMenu}
        onSelectionContextMenu={handleSelectionContextMenu}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        disableKeyboardA11y={true}
        fitView={true}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
        onNodeDragStop={onNodeDragStop}
        onBeforeDelete={onBeforeDelete}
        ref={containerRef}
        defaultEdgeOptions={{
          type: "Deletable",
        }}
      >
        <Background bgColor="#14141d" color="#a7abc2" />
        <RightPanel />
        <CenterPanel />
        <LeftPanel />
        <Toaster />
      </ReactFlow>

      {shouldShowPaneContextMenu && (
        <PaneContextMenu
          ref={paneContextMenuRef}
          x={paneContextMenuX}
          y={paneContextMenuY}
          onClose={handleCloseCombinedMenu}
        />
      )}
      {nodeContextMenu && (
        <NodeContextMenu
          ref={nodeContextMenuRef}
          nodeId={nodeContextMenu.nodeId}
          nodeType={nodeContextMenu.nodeType}
          nodeLoopId={nodeContextMenu.nodeLoopId}
          nodeParentId={nodeContextMenu.nodeParentId}
          x={nodeContextMenu.x}
          y={nodeContextMenu.y}
          onClose={() => setNodeContextMenu(null)}
        />
      )}
      {selectionContextMenu && (
        <SelectionContextMenu
          ref={selectionContextMenuRef}
          nodeIds={selectionContextMenu.nodeIds}
          x={selectionContextMenu.x}
          y={selectionContextMenu.y}
          onClose={() => setSelectionContextMenu(null)}
        />
      )}
    </>
  );
};

const NodeEditor = () => (
  <ReactFlowProvider>
    <TooltipProvider>
      <Editor />
    </TooltipProvider>
  </ReactFlowProvider>
);

export default NodeEditor;