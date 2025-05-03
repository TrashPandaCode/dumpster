import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import AddNodePanel from "./editor-components/AddNode";
import ContextMenu from "./editor-components/ContextMenu";
import NodeContextMenu from "./editor-components/NodeContextMenu";
import { useNodeStore } from "./node-store/node-store";
import { nodeTypes } from "./nodes/node-types";
import { debugEdges, debugNodes } from "./solutions/debug";

const NodeEditor: React.FC<{ level: string }> = ({ level }) => {
  const [nodes, setNodes] = useState<Node[]>(debugNodes); // TODO: load nodes based on level
  const [edges, setEdges] = useState<Edge[]>(debugEdges);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{
    nodeId: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectionContextMenu, setSelectionContextMenu] = useState<{
    nodeIds: string[];
    x: number;
    y: number;
  } | null>(null);

  const replaceNode = useNodeStore((state) => state.replaceNode);
  const removeNode = useNodeStore((state) => state.removeNode);
  const addEdgeStore = useNodeStore((state) => state.addEdge);
  const removeEdge = useNodeStore((state) => state.removeEdge);
  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((element) => {
        switch (element.type) {
          case "add":
            break;
          case "remove":
            removeNode(element.id);
            break;
          case "replace":
            replaceNode(element.item);
            break;
        }
      });

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((element) => {
        switch (element.type) {
          case "remove":
            removeEdge(element.id);
            break;
        }
      });

      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => {
      addEdgeStore(connection);
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const handlePaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      const position = getContextMenuPosition(event);
      setContextMenu({
        x: position.x,
        y: position.y,
      });
    },
    [setContextMenu]
  );

  const handleNodeContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, node: Node) => {
      event.preventDefault();
      const position = getContextMenuPosition(event);
      setNodeContextMenu({
        nodeId: node.id,
        x: position.x,
        y: position.y,
      });
    },
    [setNodeContextMenu]
  );

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
    setNodeContextMenu(null);
    setSelectionContextMenu(null);
  }, [contextMenu, nodeContextMenu, selectionContextMenu]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        id="node-editor"
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeContextMenu={handleNodeContextMenu}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        fitView
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
      >
        <Background bgColor="#14141d" color="#a7abc2" />
        <AddNodePanel />
        <Panel position="top-right">
          <button onClick={nodeStateDebugPrint} className="bg-white p-2">
            Print Map
          </button>
        </Panel>
      </ReactFlow>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
      {nodeContextMenu && (
        <NodeContextMenu
          nodeId={nodeContextMenu.nodeId}
          x={nodeContextMenu.x}
          y={nodeContextMenu.y}
          onClose={() => setNodeContextMenu(null)}
        />
      )}
    </ReactFlowProvider>
  );
};

export default NodeEditor;

function getContextMenuPosition(event: MouseEvent | React.MouseEvent): {
  x: number;
  y: number;
} {
  //Specific numbers for ContextMenu size might need to be changed later depending on if the ContextMenu receives any changes
  const x =
    (event as React.MouseEvent).clientX > window.innerWidth - 274
      ? window.innerWidth - 274
      : (event as React.MouseEvent).clientX;
  const y =
    (event as React.MouseEvent).clientY > window.innerHeight - 266
      ? window.innerHeight - 266
      : (event as React.MouseEvent).clientY;
  return { x: x - 15, y: y - 15 };
}
