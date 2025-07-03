/*
 * Authors:
 *
 * Purpose:
 */
import type { Node } from "@xyflow/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useNodeAddMenuStore } from "../../zustand/node-add-menu-store";
import {
  useCopyHotkey,
  useDuplicateHotkey,
  useEscapeHotkey,
  useNewNodeHotkey,
  usePasteHotkey,
  useRedoHotkey,
  useUndoHotkey,
} from "./useShortcuts";

/**
 * Custom hook to manage context menus in a node editor.
 * It provides handlers for pane, node, and selection context menus,
 * as well as dimensions and visibility management.
 */
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

  const [menuDimensions, setMenuDimensions] = useState<{
    pane: { width: number; height: number };
    node: { width: number; height: number };
    selection: { width: number; height: number };
  }>({
    pane: { width: 270, height: 280 },
    node: { width: 270, height: 280 },
    selection: { width: 270, height: 280 },
  });

  const paneContextMenuRef = useRef<HTMLDivElement>(null);
  const nodeContextMenuRef = useRef<HTMLDivElement>(null);
  const selectionContextMenuRef = useRef<HTMLDivElement>(null);

  const {
    visible,
    closeAddMenu,
    menuX: addMenuX,
    menuY: addMenuY,
  } = useNodeAddMenuStore();

  useLayoutEffect(() => {
    if (paneContextMenuRef.current) {
      const rect = paneContextMenuRef.current.getBoundingClientRect();
      setMenuDimensions((prev) => ({
        ...prev,
        pane: { width: rect.width, height: rect.height },
      }));
    }
  }, [paneContextMenu]);

  useLayoutEffect(() => {
    if (nodeContextMenuRef.current) {
      const rect = nodeContextMenuRef.current.getBoundingClientRect();
      setMenuDimensions((prev) => ({
        ...prev,
        node: { width: rect.width, height: rect.height },
      }));
    }
  }, [nodeContextMenu]);

  useLayoutEffect(() => {
    if (selectionContextMenuRef.current) {
      const rect = selectionContextMenuRef.current.getBoundingClientRect();
      setMenuDimensions((prev) => ({
        ...prev,
        selection: { width: rect.width, height: rect.height },
      }));
    }
  }, [selectionContextMenu]);

  const handlePaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      const position = getContextMenuPosition(event, menuDimensions.pane);
      setPaneContextMenu({
        x: position.x,
        y: position.y,
      });
    },
    [menuDimensions.pane]
  );

  const handleNodeContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, node: Node) => {
      event.preventDefault();
      const position = getContextMenuPosition(event, menuDimensions.node);
      setNodeContextMenu({
        nodeId: node.id,
        nodeType: node.type,
        nodeLoopId: node.data.loopId as string | undefined,
        nodeParentId: node.parentId,
        x: position.x,
        y: position.y,
      });
    },
    [menuDimensions.node]
  );

  const handleSelectionContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, nodes: Node[]) => {
      event.preventDefault();

      if (nodes.length === 0) return;

      const position = getContextMenuPosition(event, menuDimensions.selection);
      setSelectionContextMenu({
        nodeIds: nodes.map((n) => n.id),
        x: position.x,
        y: position.y,
      });
    },
    [menuDimensions.selection]
  );

  const closeAllMenus = useCallback(() => {
    setPaneContextMenu(null);
    setNodeContextMenu(null);
    setSelectionContextMenu(null);
    useNodeAddMenuStore.getState().closeAddMenu();
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
  useUndoHotkey();
  useRedoHotkey();
  useCopyHotkey();
  usePasteHotkey();

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
    paneContextMenuRef,
    nodeContextMenuRef,
    selectionContextMenuRef,
  };
}

function getContextMenuPosition(
  event: MouseEvent | React.MouseEvent,
  dimensions: { width: number; height: number }
): {
  x: number;
  y: number;
} {
  const clientX = (event as React.MouseEvent).clientX;
  const clientY = (event as React.MouseEvent).clientY;

  const x =
    clientX > window.innerWidth - dimensions.width
      ? window.innerWidth - dimensions.width
      : clientX;
  const y =
    clientY > window.innerHeight - dimensions.height
      ? window.innerHeight - dimensions.height
      : clientY;

  return { x: x - 15, y: y - 15 };
}
