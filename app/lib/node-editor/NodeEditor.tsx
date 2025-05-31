import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  type ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useRef, useState } from "react";
import { Toaster } from "sonner";

import LeftPanel from "./editor-components/LeftPanel";
import NodeContextMenu from "./editor-components/NodeContextMenu";
import PaneContextMenu from "./editor-components/PaneContextMenu";
import RightPanel from "./editor-components/RightPanel";
import SelectionContextMenu from "./editor-components/SelectionContextMenu";
import { ShortcutManager } from "./editor-components/ShortcutManager";
import { TooltipProvider } from "./editor-components/Tooltip";
import { useContextMenu } from "./hooks/useContextMenu";
import { useFlow } from "./hooks/useFlow";
import { useMouseTrackingInPane } from "./hooks/useGlobalMouseTracker";
import { useNodeAddMenuStore } from "./node-store/node-add-menu-store";
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

  const { x, y, visible, closeAddMenu } = useNodeAddMenuStore();
  const containerRef = useRef<HTMLDivElement>(null);
  useMouseTrackingInPane(containerRef);
  return (
    <>
      <ReactFlow
        id="node-editor"
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
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
        fitView
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
        onNodeDragStop={onNodeDragStop}
        ref={containerRef}
      >
        <Background bgColor="#14141d" color="#a7abc2" />
        <RightPanel rfInstance={rfInstance} />
        <LeftPanel />
        <ShortcutManager />
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
      {visible && <PaneContextMenu x={x} y={y} onClose={closeAddMenu} />}
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
