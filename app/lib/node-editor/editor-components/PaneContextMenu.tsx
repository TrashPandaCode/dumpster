/*
 * Authors:
 *
 * Purpose:
 */
import { useReactFlow } from "@xyflow/react";
import React, { useCallback } from "react";

import { useClipboardStore } from "~/lib/zustand/clipboard";
import useIsMac from "../hooks/useMac";
import { duplicateNodes } from "../utils/duplicate";
import AddNodes from "./AddNodes";

const PaneContextMenu = React.forwardRef<
  HTMLDivElement,
  {
    x: number;
    y: number;
    onClose: () => void;
  }
>(({ x, y, onClose }, ref) => {
  const { hasCopiedNodes } = useClipboardStore();

  return (
    <div
      ref={ref}
      style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}
    >
      <AddNodes x={x} y={y} onClose={onClose}>
        {hasCopiedNodes() && <PasteSection x={x} y={y} onClose={onClose} />}
      </AddNodes>
    </div>
  );
});

export default PaneContextMenu;

const PasteSection = ({
  x,
  y,
  onClose,
}: {
  x: number;
  y: number;
  onClose: () => void;
}) => {
  const { getNodes, setNodes, getEdges, setEdges, screenToFlowPosition } =
    useReactFlow();
  const { copiedNodes } = useClipboardStore();
  const isMac = useIsMac();

  const handlePaste = useCallback(() => {
    if (copiedNodes.length === 0) return;

    // Convert the context menu position (screen coordinates) to flow coordinates
    const flowPosition = screenToFlowPosition({ x, y });

    // Use the same duplicateNodes function as in the hotkey
    duplicateNodes(copiedNodes, getEdges, getNodes, setEdges, setNodes, {
      targetPosition: flowPosition,
    });

    // Update the last paste position in clipboard store
    useClipboardStore.setState({
      lastPastePosition: { x, y },
    });

    onClose();
  }, [
    copiedNodes,
    x,
    y,
    getNodes,
    setNodes,
    getEdges,
    setEdges,
    screenToFlowPosition,
    onClose,
  ]);

  return (
    <button
      className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
      onClick={handlePaste}
    >
      <span>Paste</span>
      <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
        {isMac ? "⌥+V" : "Ctrl+V"}
      </span>
    </button>
  );
};
