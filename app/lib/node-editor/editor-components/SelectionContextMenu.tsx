/*
 * Authors:
 *
 * Purpose:
 */
import { Panel, useReactFlow, type Node } from "@xyflow/react";
import React, { useCallback } from "react";

import { useClipboardStore } from "~/lib/zustand/clipboard";
import useIsMac from "../hooks/useMac";
import { duplicateNodes } from "../utils/duplicate";
import { collectRelevantNodes } from "../utils/relevantnodes";

const SelectionContextMenu = React.forwardRef<
  HTMLDivElement,
  {
    nodeIds: string[];
    x: number;
    y: number;
    onClose: () => void;
  }
>(({ nodeIds, x, y, onClose }, ref) => {
  const { getNodes, getEdges, setNodes, setEdges, deleteElements } =
    useReactFlow();
  const { setCopiedNodes } = useClipboardStore();

  // handle copying selected nodes
  const copyNodes = useCallback(() => {
    const allNodes = getNodes();
    const nodesToCopy = collectRelevantNodes(nodeIds, allNodes);
    setCopiedNodes(nodesToCopy);
    onClose();
  }, [getNodes, nodeIds, setCopiedNodes, onClose]);

  // handle duplicating selected nodes with proper loop/group handling
  const duplicateSelectedNodes = useCallback(() => {
    const allNodes = getNodes();
    const nodesToDuplicate = collectRelevantNodes(nodeIds, allNodes);
    duplicateNodes(nodesToDuplicate, getEdges, getNodes, setEdges, setNodes);
    onClose();
  }, [getNodes, getEdges, setNodes, setEdges, nodeIds, onClose]);

  const deleteNodes = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    deleteElements({
      nodes: nodes.filter((n) => nodeIds.includes(n.id)),
      edges: edges.filter(
        (e) => nodeIds.includes(e.source) || nodeIds.includes(e.target)
      ),
    });
    onClose();
  }, [deleteElements, getEdges, getNodes, nodeIds, onClose]);
  const isMac = useIsMac();
  return (
    <div
      ref={ref}
      style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}
    >
      <Panel className="flex w-55 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={copyNodes}
        >
          <span>Copy {nodeIds.length} nodes</span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            {isMac ? "⌥+C" : "Ctrl+C"}
          </span>
        </button>
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={duplicateSelectedNodes}
        >
          <span>Duplicate {nodeIds.length} nodes</span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            {isMac ? "⌥+D" : "Ctrl+D"}
          </span>
        </button>
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={deleteNodes}
        >
          <span>Delete {nodeIds.length} nodes</span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            Del
          </span>
        </button>
      </Panel>
    </div>
  );
});

export default SelectionContextMenu;
