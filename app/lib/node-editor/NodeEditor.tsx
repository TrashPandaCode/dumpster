import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import AddNodePanel from "./editor-components/AddNode";
import ContextMenu from "./editor-components/ContextMenu";
import { useNodeStore } from "./node-store/node-store";
import { nodeTypes } from "./nodes/node-types";
import { debugEdges, debugNodes } from "./solutions/debug";

const NodeEditor = () => {
  const [nodes, setNodes] = useState<Node[]>(debugNodes);
  const [edges, setEdges] = useState<Edge[]>(debugEdges);
  const [contextMenu, setContextMenu] = useState<{
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
  const handlePaneContextMenu = (event: MouseEvent | React.MouseEvent) => {
    event.preventDefault();
    let x = (event as React.MouseEvent).clientX ;
    let y = (event as React.MouseEvent).clientY;
    console.log(x,y)
    console.log(window.innerWidth, window.innerHeight)
    if(y > window.innerHeight * 0.73){ // Number might need to be changed if ContextMenu height changes
        y = y - (y - (window.innerHeight * 0.73));
    }
    if(x > window.innerWidth * 0.86){ // Number might need to be changed if ContextMenu width changes
      x = x - (x - (window.innerWidth * 0.86));
    }
    setContextMenu({
      x: x - 15,
      y: y - 15,
    });
  };
  const handleClick = () => {
    setContextMenu(null);
  };

  return (
    <div style={{ height: "100%" }} onClick={handleClick}>
      <ReactFlowProvider>
        <ReactFlow
          id="node-editor"
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneContextMenu={handlePaneContextMenu}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Delete", "Backspace"]}
        >
          <Background bgColor="#14141d" color="#a7abc2" />
          {/* <Controls className="text-white !bg-slate-800" /> sind kacke zu stylen */}
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
      </ReactFlowProvider>
    </div>
  );
};

export default NodeEditor;
