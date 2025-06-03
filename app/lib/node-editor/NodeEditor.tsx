import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  type ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useState } from "react";
import { Toaster } from "sonner";

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

const Editor = () => {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
  } = useFlow();

  const {
    paneContextMenu,
    nodeContextMenu,
    selectionContextMenu,
    handlePaneContextMenu,
    handleNodeContextMenu,
    handleSelectionContextMenu,
    onPaneClick,
    setNodeContextMenu,
    setPaneContextMenu,
    setSelectionContextMenu,
  } = useContextMenu();
  return (
    <>
      <ReactFlow
        id="node-editor"
        onInit={setRfInstance}
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
        fitView={false}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
        onNodeDragStop={onNodeDragStop}
        defaultEdgeOptions={{
          type: "Deletable",
        }}
      >
        <Background bgColor="#14141d" color="#a7abc2" />
        <RightPanel rfInstance={rfInstance} />
        <CenterPanel />
        <LeftPanel />
        <Toaster />
      </ReactFlow>
      {paneContextMenu && (
        <PaneContextMenu
          x={paneContextMenu.x}
          y={paneContextMenu.y}
          onClose={() => setPaneContextMenu(null)}
        />
      )}
      {nodeContextMenu && (
        <NodeContextMenu
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
