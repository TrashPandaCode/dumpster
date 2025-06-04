import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

import { flowMouseTracker } from "~/lib/game/utils/flowMouseTracker";
import { globalKeyTracker } from "../../game/utils/globalKeyTracker";
import { useNodeAddMenuStore } from "../node-store/node-add-menu-store";
import { duplicateNodes } from "../utils";

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();

  useEffect(() => {
    // Use the cross-platform shortcut (Cmd+D on Mac, Ctrl+D on others)
    const shortcut = globalKeyTracker.createPlatformShortcut("d");

    const remove = globalKeyTracker.registerShortcut(shortcut, (e) => {
      const selectedNodeIds = getNodes().filter((n) => n.selected);

      if (selectedNodeIds.length > 0) {
        duplicateNodes(selectedNodeIds, getEdges, getNodes, setEdges, setNodes);
      }
    });

    return remove;
  }, [getNodes, getEdges, setEdges, setNodes]);
}

// Hook to handle adding a new node with a hotkey
export function useNewNodeHotkey() {
  useEffect(() => {
    // Use the cross-platform shortcut (Cmd+Space on Mac, Ctrl+Space on others)
    const shortcut = globalKeyTracker.createPlatformShortcut(" ");

    const remove = globalKeyTracker.registerShortcut(shortcut, (e) => {
      // Get the current mouse position in the flow editor
      const position = flowMouseTracker.getPosition();

      if (position) {
        useNodeAddMenuStore
          .getState()
          .openAddMenu(position.clientX, position.clientY);
      }
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
    const remove = globalKeyTracker.registerShortcut("Escape", (e) => {
      if (condition && callback) {
        callback();
      }
    });

    return remove;
  }, [callback, condition]);
}
