import { useReactFlow } from "@xyflow/react";
import { use, useEffect } from "react";

import { flowMouseTracker } from "~/lib/game/utils/flowMouseTracker";
import { globalKeyTracker } from "../../game/utils/globalKeyTracker";
import { useLoopStore } from "../node-store/loop-store";
import { useNodeAddMenuStore } from "../node-store/node-add-menu-store";
import { duplicateNodes } from "../utils";

export function useDuplicateHotkey() {
  const addHandle = useLoopStore((state) => state.addHandle);
  const getHandles = useLoopStore((state) => state.getHandles);
  const { getNodes, getEdges, addNodes, addEdges, setNodes, setEdges } =
    useReactFlow();

  useEffect(() => {
    const remove = globalKeyTracker.shortcutListener("Control+d", (e) => {
      console.log("Duplicate nodes hotkey pressed");

      const selectedNodeIds = getNodes().filter((n) => n.selected);

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

export function useNewNodeHotkey() {
  useEffect(() => {
    const remove = globalKeyTracker.shortcutListener("Control+ ", (e) => {
      const position = flowMouseTracker.getPosition();
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
