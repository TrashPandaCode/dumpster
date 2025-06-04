import type { Node } from "@xyflow/react";
import { useCallback, useState } from "react";

import { useNodeAddMenuStore } from "../node-store/node-add-menu-store";
import { getContextMenuPosition } from "../utils";
import {
  useDuplicateHotkey,
  useEscapeHotkey,
  useNewNodeHotkey,
} from "./useShortcuts";

export function useContextMenu() {
  const [paneContextMenu, setPaneContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{
    nodeId: string;
    nodeType: string | undefined;
    nodeLoopId: string | undefined;
    nodeParentId: string | undefined;
    x: number;
    y: number;
  } | null>(null);
  const [selectionContextMenu, setSelectionContextMenu] = useState<{
    nodeIds: string[];
    x: number;
    y: number;
  } | null>(null);

  const {
    visible,
    closeAddMenu,
    x: addMenuX,
    y: addMenuY,
  } = useNodeAddMenuStore();

  const handlePaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      const position = getContextMenuPosition(event);
      setPaneContextMenu({
        x: position.x,
        y: position.y,
      });
    },
    [setPaneContextMenu]
  );

  const handleNodeContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, node: Node) => {
      event.preventDefault();
      const position = getContextMenuPosition(event);
      setNodeContextMenu({
        nodeId: node.id,
        nodeType: node.type,
        nodeLoopId: node.data.loopId as string | undefined,
        nodeParentId: node.parentId,
        x: position.x,
        y: position.y,
      });
    },
    [setNodeContextMenu]
  );

  const handleSelectionContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, nodes: Node[]) => {
      event.preventDefault();

      if (nodes.length === 0) return;

      const position = getContextMenuPosition(event);
      setSelectionContextMenu({
        nodeIds: nodes.map((n) => n.id),
        x: position.x,
        y: position.y,
      });
    },
    [setSelectionContextMenu]
  );

  const closeAllMenus = useCallback(() => {
    setPaneContextMenu(null);
    setNodeContextMenu(null);
    setSelectionContextMenu(null);
    if (useNodeAddMenuStore.getState().visible) {
      useNodeAddMenuStore.getState().closeAddMenu();
    }
  }, []);

  const onPaneClick = closeAllMenus;

  const anyOpen =
    paneContextMenu !== null ||
    nodeContextMenu !== null ||
    selectionContextMenu !== null ||
    useNodeAddMenuStore.getState().visible;

  useEscapeHotkey(closeAllMenus, anyOpen);
  useDuplicateHotkey();
  useNewNodeHotkey();

  const shouldShowPaneContextMenu = paneContextMenu || visible;
  const paneContextMenuX = paneContextMenu?.x ?? addMenuX;
  const paneContextMenuY = paneContextMenu?.y ?? addMenuY;

  const handleCloseCombinedMenu = () => {
    setPaneContextMenu(null);
    closeAddMenu();
  };

  return {
    paneContextMenu,
    nodeContextMenu,
    selectionContextMenu,
    shouldShowPaneContextMenu,
    paneContextMenuX,
    paneContextMenuY,
    setPaneContextMenu,
    setNodeContextMenu,
    setSelectionContextMenu,
    handlePaneContextMenu,
    handleNodeContextMenu,
    handleSelectionContextMenu,
    handleCloseCombinedMenu,
    onPaneClick,
  };
}
