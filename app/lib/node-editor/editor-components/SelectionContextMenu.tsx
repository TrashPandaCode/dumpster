import { Panel, useReactFlow } from "@xyflow/react";
import React, { useCallback } from "react";

import { useLoopStore } from "../node-store/loop-store";
import { duplicateNodes } from "../utils";

type SelectionContextMenuProps = {
  nodeIds: string[];
  x: number;
  y: number;
  onClose: () => void;
};

const SelectionContextMenu: React.FC<SelectionContextMenuProps> = ({
  nodeIds,
  x,
  y,
  onClose,
}) => {
  const addHandle = useLoopStore((state) => state.addHandle);
  const getHandles = useLoopStore((state) => state.getHandles);
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const deleteNodes = useCallback(() => {
    setNodes((nodes) => nodes.filter((n) => !nodeIds.includes(n.id)));
    setEdges((edges) =>
      edges.filter(
        (e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
      )
    );
    onClose();
  }, [nodeIds, setNodes, setEdges, onClose]);

  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <Panel className="flex w-55 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={() => {
            duplicateNodes(
              getNodes().filter((n) => nodeIds.includes(n.id)),
              getEdges,
              getNodes,
              setEdges,
              setNodes,
              addHandle,
              getHandles
            );
            onClose();
          }}
        >
          <span>Duplicate {nodeIds.length} nodes </span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            Ctrl+D
          </span>
        </button>
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={deleteNodes}
        >
          <span>Delete {nodeIds.length} nodes </span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            Del
          </span>
        </button>
      </Panel>
    </div>
  );
};

export default SelectionContextMenu;
