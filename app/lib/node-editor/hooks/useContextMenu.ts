import type { Node } from "@xyflow/react";
import { useCallback, useState } from "react";

export function useContextMenu() {
  function getContextMenuPosition(event: MouseEvent | React.MouseEvent): {
    x: number;
    y: number;
  } {
    //Specific numbers for ContextMenu size might need to be changed later depending on if the ContextMenu receives any changes
    //TODO: if this is really needed, calculate the size of the ContextMenu dynamically
    const x =
      (event as React.MouseEvent).clientX > window.innerWidth - 274
        ? window.innerWidth - 274
        : (event as React.MouseEvent).clientX;
    const y =
      (event as React.MouseEvent).clientY > window.innerHeight - 284
        ? window.innerHeight - 284
        : (event as React.MouseEvent).clientY;
    return { x: x - 15, y: y - 15 };
  }
  const [paneContextMenu, setPaneContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{
    nodeId: string;
    nodeType: string | undefined;
    nodeLoopId: string | undefined;
    x: number;
    y: number;
  } | null>(null);
  const [selectionContextMenu, setSelectionContextMenu] = useState<{
    nodeIds: string[];
    x: number;
    y: number;
  } | null>(null);

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

  const onPaneClick = useCallback(() => {
    setPaneContextMenu(null);
    setNodeContextMenu(null);
    setSelectionContextMenu(null);
  }, [setPaneContextMenu, setNodeContextMenu, setSelectionContextMenu]);

  return {
    paneContextMenu,
    nodeContextMenu,
    selectionContextMenu,
    setPaneContextMenu,
    setNodeContextMenu,
    setSelectionContextMenu,
    handlePaneContextMenu,
    handleNodeContextMenu,
    handleSelectionContextMenu,
    onPaneClick,
  };
}
