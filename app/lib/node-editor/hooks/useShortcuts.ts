import { useReactFlow, type Node } from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";

import { useClipboardStore } from "~/lib/zustand/clipboard";
import { useNodeAddMenuStore } from "../../zustand/node-add-menu-store";
import { duplicateNodes } from "../utils/duplicate";
import { collectRelevantNodes } from "../utils/relevantnodes";
import { redo, undo } from "../utils/undo";
import useIsMac from "./useMac";

// Hook to handle copying nodes with a hotkey
export function useCopyHotkey() {
  const { getNodes } = useReactFlow();
  const { setCopiedNodes } = useClipboardStore();
  const isMacOS = useIsMac();
  const shortcuts = isMacOS ? "alt+c" : "ctrl+c";

  useHotkeys(
    shortcuts,
    (e) => {
      const allNodes = getNodes();
      const selectedNodeIds = allNodes
        .filter((n) => n.selected)
        .map((n) => n.id);

      if (selectedNodeIds.length > 0) {
        const nodesToCopy = collectRelevantNodes(selectedNodeIds, allNodes);
        setCopiedNodes(nodesToCopy);
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [getNodes, setCopiedNodes, isMacOS]
  );
}

// Hook to handle pasting nodes with a hotkey
export function usePasteHotkey() {
  const { getNodes, getEdges, setEdges, setNodes, screenToFlowPosition } =
    useReactFlow();
  const { copiedNodes, hasCopiedNodes, lastPastePosition } =
    useClipboardStore();
  const { mousePosition, canvasContainer } = useNodeAddMenuStore();
  const isMacOS = useIsMac();
  const shortcuts = isMacOS ? "alt+v" : "ctrl+v";

  // Function to get the paste position based on mouse position or last paste position
  const getPastePosition = (): { x: number; y: number } | null => {
    let pasteX: number;
    let pasteY: number;

    if (mousePosition) {
      // If mouse position is available, use it (client coordinates for screen position)
      pasteX = mousePosition.clientX;
      pasteY = mousePosition.clientY;
    } else if (lastPastePosition) {
      // If mouse position is not available, use the last paste position with offset
      pasteX = lastPastePosition.x + 50;
      pasteY = lastPastePosition.y + 50;
    } else if (canvasContainer) {
      // If no coordinates are available, use the center of the canvas container
      const bounds = canvasContainer.getBoundingClientRect();
      pasteX = bounds.left + bounds.width / 2;
      pasteY = bounds.top + bounds.height / 2;
    } else {
      console.warn("Cannot determine paste position: no coordinates available");
      return null;
    }

    return { x: pasteX, y: pasteY };
  };

  useHotkeys(
    shortcuts,
    (e) => {
      if (hasCopiedNodes()) {
        const screenPosition = getPastePosition();

        if (screenPosition) {
          // Convert screen coordinates to flow coordinates
          const flowPosition = screenToFlowPosition(screenPosition);
          duplicateNodes(copiedNodes, getEdges, getNodes, setEdges, setNodes, {
            targetPosition: flowPosition,
          });

          // Store this position for next time in clipboard store
          useClipboardStore.setState({
            lastPastePosition: screenPosition,
          });
        } else {
          // Fallback to default behavior if no position available
          duplicateNodes(copiedNodes, getEdges, getNodes, setEdges, setNodes);
        }
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [
      copiedNodes,
      hasCopiedNodes,
      lastPastePosition,
      mousePosition,
      canvasContainer,
      getNodes,
      getEdges,
      setEdges,
      setNodes,
      screenToFlowPosition,
      isMacOS,
    ]
  );
}

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();
  const shortcuts = ["ctrl+d", "alt+d"];

  useHotkeys(
    shortcuts,
    (e) => {
      const allNodes = getNodes();
      const selectedNodeIds = allNodes
        .filter((n) => n.selected)
        .map((n) => n.id);

      if (selectedNodeIds.length > 0) {
        const nodesToDuplicate = collectRelevantNodes(
          selectedNodeIds,
          allNodes
        );
        duplicateNodes(
          nodesToDuplicate,
          getEdges,
          getNodes,
          setEdges,
          setNodes
        );
      }
    },
    {
      preventDefault: true,
    },
    [getNodes, getEdges, setEdges, setNodes]
  );
}

// Hook to handle adding a new node with a hotkey
export function useNewNodeHotkey() {
  const { visible, openAddMenu, closeAddMenu } = useNodeAddMenuStore();
  const shortcuts = ["ctrl+space", "alt+space"];

  useHotkeys(
    shortcuts,
    (e) => {
      if (visible) closeAddMenu();
      else openAddMenu();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [visible]
  );
}

// Hook to handle undo
export function useUndoHotkey() {
  const isMacOS = useIsMac();
  const shortcuts = isMacOS ? "alt+y" : "ctrl+z";

  useHotkeys(
    shortcuts,
    (e) => {
      undo();
    },
    { preventDefault: true, useKey: true },
    [isMacOS]
  );
}

// Hook to handle redo
export function useRedoHotkey() {
  const isMacOS = useIsMac();
  const shortcuts = isMacOS
    ? ["alt+shift+y", "alt+z"]
    : ["ctrl+y", "ctrl+shift+z"];

  useHotkeys(
    shortcuts,
    (e) => {
      redo();
    },
    { preventDefault: true, useKey: true },
    [isMacOS]
  );
}

// Hook to handle the Escape key for closing menus
export function useEscapeHotkey(
  callback?: () => void,
  condition: boolean = true
) {
  useHotkeys(
    "esc",
    (e) => {
      if (condition && callback) callback();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [callback, condition]
  );
}
