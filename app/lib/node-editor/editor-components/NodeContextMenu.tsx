import { Panel, useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

type NodeContextMenuProps = {
  nodeId: string;
  x: number;
  y: number;
  onClose: () => void;
};

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  x,
  y,
  onClose,
}) => {
  const {
    getNode,
    getNodes,
    setNodes,
    addNodes,
    getEdges,
    setEdges,
    addEdges,
  } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId);
    if (!node) return;

    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    const newId = uuidv4();

    addNodes({
      ...node,
      selected: true,
      dragging: false,
      id: newId,
      position,
    });

    const children = getNodes().filter((n) => n.parentId === nodeId);
    if (children.length > 0) {
      const idMap = new Map<string, string>();

      const newChildren: Node[] = children.map((child) => {
        const newChildId = uuidv4();
        idMap.set(child.id, newChildId);

        return {
          ...child,
          id: newChildId,
          parentId: newId,
          position: {
            x: child.position.x,
            y: child.position.y,
          },
          selected: false,
          dragging: false,
        };
      });

      const newEdges: Edge[] = getEdges()
        .filter((e) => idMap.has(e.source) && idMap.has(e.target))
        .map((e) => {
          const newSource = idMap.get(e.source)!;
          const newTarget = idMap.get(e.target)!;
          return {
            ...e,
            id:
              "xy-edge__" +
              newSource +
              e.sourceHandle! +
              "-" +
              newTarget +
              e.targetHandle,
            source: newSource,
            target: newTarget,
            selected: false,
          };
        });
      addNodes(newChildren);
      addEdges(newEdges);
    }

    onClose();
  }, [nodeId, getNode, addNodes]);

  // const duplicateNode = useCallback(() => {
  //   const toDuplicate = getNodes().filter((n) => n.id === nodeId);
  //   toDuplicate.push(...getNodes().filter((n) => n.parentId === nodeId));
  //   if (toDuplicate.length < 1) return;

  //   const idMap = new Map<string, string>();

  //   const newNodes: Node[] = toDuplicate.map((node) => {
  //     const newId = uuidv4();
  //     idMap.set(node.id, newId);

  //     return {
  //       ...node,
  //       id: newId,
  //       parentId: node.parentId === nodeId ? newId : node.parentId,
  //       position: {
  //         x: node.position.x + 50,
  //         y: node.position.y + 50,
  //       },
  //       selected: false,
  //       dragging: false,
  //     };
  //   });

  //   const newEdges: Edge[] = getEdges()
  //     .filter((e) => idMap.has(e.source) && idMap.has(e.target))
  //     .map((e) => {
  //       const newSource = idMap.get(e.source)!;
  //       const newTarget = idMap.get(e.target)!;
  //       return {
  //         ...e,
  //         id:
  //           "xy-edge__" +
  //           newSource +
  //           e.sourceHandle! +
  //           "-" +
  //           newTarget +
  //           e.targetHandle,
  //         source: newSource,
  //         target: newTarget,
  //         selected: false,
  //       };
  //     });

  //   addNodes(newNodes);
  //   addEdges(newEdges);

  //   onClose();
  // }, [nodeId, getNode, setNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
    onClose();
  }, [nodeId, setNodes, setEdges]);

  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <Panel className="flex w-36 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={duplicateNode}
        >
          Duplicate
        </button>
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={deleteNode}
        >
          Delete
        </button>
      </Panel>
    </div>
  );
};

export default NodeContextMenu;
