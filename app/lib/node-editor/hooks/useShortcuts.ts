import { useReactFlow } from "@xyflow/react";
import { use, useEffect } from "react";

import { globalKeyTracker } from "../../game/utils/globalKeyTracker";
import { useNodeActions } from "../hooks/useNodeActions";

export function useDuplicateHotkey() {
  const { getNodes } = useReactFlow();
  const { duplicateNodes } = useNodeActions();

  useEffect(() => {
    const remove = globalKeyTracker.shortcutListener("Control+d", (e) => {
      const selectedNodeIds = getNodes()
        .filter((n) => n.selected)
        .map((n) => n.id);
      if (selectedNodeIds.length > 0) {
        duplicateNodes(selectedNodeIds);
      }
    });

    return () => {
      remove();
    };
  }, [duplicateNodes, getNodes]);
}

export function useNewNodeHotkey() {
  useEffect(() => {
    const remove = globalKeyTracker.shortcutListener("Control+n", (e) => {});
  });
}
