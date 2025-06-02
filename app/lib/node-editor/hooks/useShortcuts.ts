import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

import { flowMouseTracker } from "~/lib/game/utils/flowMouseTracker";
import { globalKeyTracker } from "../../game/utils/globalKeyTracker";
import { useLoopStore } from "../node-store/loop-store";
import { useNodeAddMenuStore } from "../node-store/node-add-menu-store";
import { duplicateNodes } from "../utils";

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const addHandle = useLoopStore((state) => state.addHandle);
  const getHandles = useLoopStore((state) => state.getHandles);
  const { getNodes, getEdges, addNodes, addEdges, setNodes } = useReactFlow();

  useEffect(() => {
    // This function is called when the user presses the hotkey for duplicating nodes
    const remove = globalKeyTracker.shortcutListener("Control+d", (e) => {
      console.log("Duplicate nodes hotkey pressed");

      const selectedNodeIds = getNodes().filter((n) => n.selected);

      // If there are no selected nodes, do nothing
      // If there are selected nodes, duplicate them
      if (selectedNodeIds.length > 0) {
        duplicateNodes(
          selectedNodeIds,
          addNodes,
          addEdges,
          getEdges,
          setNodes,
          addHandle,
          getHandles
        );
      }
    });

    return () => {
      remove();
    };
  }, [duplicateNodes, getNodes]);
}

// Hook to handle adding a new node with a hotkey
export function useNewNodeHotkey() {
  useEffect(() => {
    // This function is called when the user presses the hotkey for adding a new node
    const remove = globalKeyTracker.shortcutListener("Control+ ", (e) => {
      //Get the current mouse position in the flow editor
      const position = flowMouseTracker.getPosition();
      // If the position is valid, open the add menu at that position
      if (position) {
        useNodeAddMenuStore
          .getState()
          .openAddMenu(position.clientX, position.clientY);
      }
    });
    return () => {
      remove();
    };
  }, []);
}

// Hook to handle the Escape key for closing menus
export function useEscapeHotkey(
  callback?: () => void,
  condition: boolean = true
) {
  useEffect(() => {
    // This function is called when the user presses the Escape key
    const remove = globalKeyTracker.shortcutListener("Escape", (e) => {
      // If the condition is true and a callback is provided, call the callback
      if (condition && callback) {
        callback();
      }
    });
    return () => {
      remove();
    };
  }, [callback, condition]);
}
