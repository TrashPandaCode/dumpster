import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { connectNodesToLoop, createForLoop } from "../utils";
import AddNodesPanel from "./AddNodesPanel";

type NodeContextMenuProps = {
  nodeId: string;
  nodeType: string | undefined;
  nodeLoopId: string | undefined;
  x: number;
  y: number;
  onClose: () => void;
};

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  nodeType,
  nodeLoopId,
  x,
  y,
  onClose,
}) => {
  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      {nodeType === "ForStart" || nodeType === "ForEnd" ? (
        <AddNodesPanel onClose={onClose} x={x} y={y} parentLoopId={nodeLoopId}>
          <hr className="mx-auto h-1 w-44 rounded-sm border-0 bg-slate-700" />
          <DefaultNodeContextMenu nodeId={nodeId} onClose={onClose} />
        </AddNodesPanel>
      ) : (
        <div className="flex w-36 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
          <DefaultNodeContextMenu nodeId={nodeId} onClose={onClose} />
        </div>
      )}
    </div>
  );
};

export default NodeContextMenu;

const DefaultNodeContextMenu = ({
  nodeId,
  onClose,
}: {
  nodeId: string;
  onClose: () => void;
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

  // handle node duplication
  const duplicateNode = useCallback(() => {
    // get the node to duplicate
    const node = getNode(nodeId);
    // if the node is not found, return
    if (!node) return;

    // calculate the new position for the duplicated node
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    if (node.data.loopStart || node.data.loopEnd) {
      // this is too simple what if the loop contains nodes
      // also state of the loop is not copied, idk maybe it should be
      // TODO issue in Github
      createForLoop(addNodes, position.x, position.y, addEdges);
    } else {
      // this is the new id for the duplicated node
      // this is also used if the node is a group and we need to duplicate the children
      const newId = uuidv4();
      addNodes({
        ...node,
        selected: false,
        dragging: false,
        id: newId,
        position,
      });
      console.log(node.data.parentLoopId);

      // if the duplicated node is part of a loop, connect it to the loop
      if (node.data.parentLoopId)
        connectNodesToLoop(
          getNodes,
          addEdges,
          [newId],
          node.data.parentLoopId as string
        );

      // if the duplicated node is a group, duplicate and handle the children of the group
      if (node.type === "Group") {
        // identify the children of the group
        const children = getNodes().filter((n) => n.parentId === nodeId);
        const oldToNewIdMap = new Map<string, string>();
        // compute new ids positions and parentId for each child
        const newChildren = children.map((child) => {
          const newChildId = uuidv4();
          // log the old and new ids for use with the edges
          oldToNewIdMap.set(child.id, newChildId);

          const childPosition = {
            x: child.position.x,
            y: child.position.y,
          };

          return {
            ...child,
            id: newChildId,
            position: childPosition,
            parentId: newId,
          };
        });
        // add the new children to the graph
        addNodes(newChildren);

        // duplicate all edges that connect to the children of the group
        // identify the edges that connect to the children of the group
        const edges = getEdges().filter((edge) => {
          const sourceId = oldToNewIdMap.get(edge.source);
          const targetId = oldToNewIdMap.get(edge.target);
          return sourceId && targetId;
        });
        // compute their new source and target ids
        const newEdges = edges.map((edge) => {
          const sourceId = oldToNewIdMap.get(edge.source) || edge.source;
          const targetId = oldToNewIdMap.get(edge.target) || edge.target;
          return {
            ...edge,
            id: uuidv4(),
            source: sourceId,
            target: targetId,
          };
        });
        // add the new edges to the graph
        addEdges(newEdges);
      }
    }

    onClose();
  }, [getNode, nodeId, onClose, addNodes, addEdges, getNodes, getEdges]);

  const deleteNode = useCallback(() => {
    const idsToDelete = [nodeId];
    if (getNode(nodeId)?.type === "Group") {
      // if the node is a group, delete all its children
      const children = getNodes().filter((n) => n.parentId === nodeId);
      idsToDelete.push(...children.map((child) => child.id));
    }

    // remove all nodes with the ids in idsToDelete
    setNodes((nodes) => nodes.filter((node) => !idsToDelete.includes(node.id)));
    // remove all edges that connect to the nodes with the ids in idsToDelete
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          !(
            idsToDelete.includes(edge.source) ||
            idsToDelete.includes(edge.target)
          )
      )
    );

    onClose();
  }, [nodeId, getNode, setNodes, setEdges, onClose, getNodes]);

  return (
    <>
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
    </>
  );
};
