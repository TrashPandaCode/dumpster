import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

import { globalKeyTracker } from "../../game/utils/globalKeyTracker";
import { useNodeAddMenuStore } from "../../zustand/node-add-menu-store";
import { duplicateNodes } from "../utils/duplicate";
import { redo, undo } from "../utils/undo";

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();
  useEffect(() => {
    // Use the cross-platform shortcut (Shift+D on Mac, Ctrl+D on others)
    const shortcut = globalKeyTracker.appendPlatformModifier("d");
    const remove = globalKeyTracker.registerShortcut(shortcut, (e) => {
      const selectedNodeIds = getNodes().filter((n) => n.selected);
      // If nodes are selected, duplicate them
      if (selectedNodeIds.length > 0)
        duplicateNodes(selectedNodeIds, getEdges, getNodes, setEdges, setNodes);
    });
    return remove;
  }, [getNodes, getEdges, setEdges, setNodes]);
}

// Hook to handle adding a new node with a hotkey
export function useNewNodeHotkey() {
  useEffect(() => {
    // Use the cross-platform shortcut (Shift+Space on Mac, Ctrl+Space on others)
    const shortcut = globalKeyTracker.appendPlatformModifier(" ");
    const remove = globalKeyTracker.registerShortcut(shortcut, (e) => {
      // Open the node add menu if it's not visible, or close it if it is
      if (useNodeAddMenuStore.getState().visible)
        useNodeAddMenuStore.getState().closeAddMenu();
      else useNodeAddMenuStore.getState().openAddMenu();
    });
    return remove;
  }, []);
}

export function useUndoHotkey() {
  useEffect(() => {
    // Use the cross-platform shortcut (Shift+Space on Mac, Ctrl+Space on others)
    const shortcut = globalKeyTracker.appendPlatformModifier("z");
    const remove = globalKeyTracker.registerShortcut(shortcut, (e) => {
      undo()
    });
    return remove;
  }, []);
}

export function useRedoHotkey() {
  useEffect(() => {
    // Use the cross-platform shortcut (Shift+Space on Mac, Ctrl+Space on others)
    const shortcut = globalKeyTracker.appendPlatformModifier("y");
    const remove = globalKeyTracker.registerShortcut(shortcut, (e) => {
      redo();
    });
    return remove;
  }, []);
}

// Hook to handle the Escape key for closing menus
export function useEscapeHotkey(
  callback?: () => void,
  condition: boolean = true
) {
  useEffect(() => {
    // Register the Escape key shortcut
    const remove = globalKeyTracker.registerShortcut("Escape", (e) => {
      // If any menu is open, close it
      if (condition && callback) callback();
    });
    return remove;
  }, [callback, condition]);
}
