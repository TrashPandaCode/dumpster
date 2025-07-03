/*
 * Authors:
 *
 * Purpose:
 */
import {
  addEdge,
  applyEdgeChanges,
  useReactFlow,
  type Edge,
  type Node,
  type OnBeforeDelete,
  type OnConnect,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";

import { toast } from "../editor-components/Toast";
import { useFlowStore } from "../node-store/flow-store";
import { useNodeStore } from "../node-store/node-store";
import { computeGroupSizings } from "../utils/groups";
import { applyNodeChanges } from "../utils/node-changes";

const selector = (state: {
  nodes: Node[];
  edges: Edge[];
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  highlightDuplicateNodes: () => void;
}) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  highlightDuplicateNodes: state.highlightDuplicateNodes,
});

/**
 * Custom hook to manage the flow of nodes and edges in a React Flow instance.
 * It provides handlers for node and edge changes, connections, and deletion.
 */
export function useFlow() {
  const { getIntersectingNodes, getNode, getNodes, getEdges } = useReactFlow();
  const { nodes, edges, setNodes, setEdges, highlightDuplicateNodes } =
    useFlowStore(useShallow(selector));

  const replaceNode = useNodeStore((state) => state.replaceNode);
  const removeNode = useNodeStore((state) => state.removeNode);
  const addEdgeStore = useNodeStore((state) => state.addEdge);
  const removeEdge = useNodeStore((state) => state.removeEdge);

  const onBeforeDelete: OnBeforeDelete = useCallback(
    async ({ nodes, edges }) => {
      const deleteNodes = new Array(...nodes);
      const deleteEdges = new Array(...edges);

      for (const node of nodes) {
        if (node?.data.loopId) {
          const otherLoopNode = getNodes().filter(
            (n) => n.id !== node.id && n.data.loopId === node.data.loopId
          )[0];
          deleteNodes.push(otherLoopNode);
          setNodes((nds) =>
            nds.map((n) => ({
              ...n,
              data: {
                ...n.data,
                parentLoopId:
                  n.data.parentLoopId === node.data.loopId
                    ? undefined
                    : n.data.parentLoopId,
              },
            }))
          );
          deleteEdges.push(
            ...getEdges().filter(
              (edg) =>
                edg.target === otherLoopNode.id ||
                edg.source === otherLoopNode.id
            )
          );
        }
      }

      return { nodes: deleteNodes, edges: deleteEdges };
    },
    [getEdges, getNodes, setNodes]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      let handleHighlight = false;

      changes.forEach((element) => {
        switch (element.type) {
          case "replace":
          case "add":
            replaceNode(element.item);
            handleHighlight = element.item.type === "ExportToGameobject";
            break;
          case "remove": {
            removeNode(element.id);
            handleHighlight = true;
            break;
          }
        }
      });
      setNodes((nds) => applyNodeChanges(changes, nds));
      if (handleHighlight) {
        highlightDuplicateNodes();
      }
    },
    [highlightDuplicateNodes, removeNode, replaceNode, setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((element) => {
        switch (element.type) {
          case "remove":
            removeEdge(element.id);
            break;
          case "add":
            addEdgeStore(element.item);
            break;
        }
      });

      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges, addEdgeStore, removeEdge]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const source = getNode(connection.source);
      const target = getNode(connection.target);

      const canConnect = () => {
        // Same loop connections
        if (
          source?.data.loopStart &&
          source.data.loopId === target?.data.loopId
        )
          return true;

        // Loop start to child node
        if (
          source?.data.loopStart &&
          target?.data.parentLoopId === source.data.loopId
        )
          return true;

        // Loop end to sibling node
        if (
          source?.data.loopEnd &&
          source.data.parentLoopId === target?.data.parentLoopId
        )
          return true;

        // Node to its loop end
        if (
          target?.data.loopEnd &&
          source?.data.parentLoopId === target.data.loopId
        )
          return true;

        // Siblings in same parent loop
        if (
          !source?.data.loopStart &&
          !target?.data.loopEnd &&
          source?.data.parentLoopId === target?.data.parentLoopId
        )
          return true;

        // Send a Toast Warning for invalid connections
        toast({
          title: "Invalid Loop Connection!",
          description:
            "Connections within loops are restricted to other nodes of the same loop. External nodes may only link to the loop's entry point or accept data from its exit point.",
        });

        return false;
      };

      if (canConnect()) {
        addEdgeStore(connection);
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [setEdges, getNode, addEdgeStore]
  );

  const onNodeDragStop: OnNodeDrag = (_event, _node, selectedNodes) => {
    const selectedBoundingRect = {
      x: Math.min(
        ...selectedNodes.map((n) =>
          n.parentId
            ? n.position.x + getNode(n.parentId)!.position.x
            : n.position.x
        )
      ),
      y: Math.min(
        ...selectedNodes.map((n) =>
          n.parentId
            ? n.position.y + getNode(n.parentId)!.position.y
            : n.position.y
        )
      ),
      width:
        Math.max(
          ...selectedNodes.map((n) => n.position.x + n.measured!.width!)
        ) - Math.min(...selectedNodes.map((n) => n.position.x)),
      height:
        Math.max(
          ...selectedNodes.map((n) => n.position.y + n.measured!.height!)
        ) - Math.min(...selectedNodes.map((n) => n.position.y)),
    };

    // only unselected groups can become new parents
    const intersectingNodes = getIntersectingNodes(selectedBoundingRect).filter(
      (n) => n.type === "Group" && n.selected === false
    );

    // choose Group with largest intersection area as new parent
    const newParentNode = intersectingNodes.reduce((largest, current) => {
      const currentArea = current.measured!.width! * current.measured!.height!;
      const largestArea = largest.measured!.width! * largest.measured!.height!;
      return currentArea > largestArea ? current : largest;
    }, intersectingNodes[0]);

    const updatedNodes: Node[] = [];
    const parentsToUpdate: Node[] = [];
    selectedNodes.forEach((node) => {
      if (node.type === "Group") {
        return; // skip groups, they cant be nested
      }

      if (!newParentNode) {
        // no new parent found
        if (node.parentId === undefined) {
          // the node is an orphan and stays an orphan
        } else if (selectedNodes.some((n) => n.id === node.parentId)) {
          // the nodes family is moving, it is not being put up for adoption
        } else {
          // the node is being put up for adoption
          const oldParentNode = getNode(node.parentId);

          if (!oldParentNode) {
            console.warn(
              `recently moved node ${node.id} has an invalid parentId of ${node.parentId}`
            );
            return; // skip this node
          }

          updatedNodes.push({
            ...node,
            parentId: undefined,
            position: {
              x: node.position.x + oldParentNode.position.x,
              y: node.position.y + oldParentNode.position.y,
            },
          });
          if (!parentsToUpdate.includes(oldParentNode)) {
            parentsToUpdate.push(oldParentNode);
          }
        }
      } else {
        // a new parent was found
        if (node.parentId === undefined) {
          // the node is an orphan and can be freely adopted into a new family
          updatedNodes.push({
            ...node,
            parentId: newParentNode.id,
            position: {
              x: node.position.x - newParentNode.position.x,
              y: node.position.y - newParentNode.position.y,
            },
          });
        } else if (newParentNode.id === node.parentId) {
          // the node is moving within its family
          // only parent needs to be updated just march on
        } else if (selectedNodes.some((n) => n.id === node.parentId)) {
          // the nodes family is moving, it is not up for adoption
        } else {
          // the node is directly adopted from it's old family, paperwork with old parent is required
          const oldParentNode = getNode(node.parentId)!;

          if (!oldParentNode) {
            console.warn(
              `recently moved node ${node.id} has an invalid parentId of ${node.parentId}`
            );
            return; // skip this node
          }

          updatedNodes.push({
            ...node,
            parentId: newParentNode.id,
            position: {
              x:
                node.position.x +
                oldParentNode.position.x -
                newParentNode.position.x,
              y:
                node.position.y +
                oldParentNode.position.y -
                newParentNode.position.y,
            },
          });
          if (!parentsToUpdate.includes(oldParentNode)) {
            parentsToUpdate.push(oldParentNode);
          }
        }
      }
      if (newParentNode) parentsToUpdate.push(newParentNode);
    });

    // update all parents
    updatedNodes.push(
      ...parentsToUpdate.map((p) => {
        const updatedChildren = updatedNodes.filter((n) => n.parentId === p.id);
        const nonUpdatedChildren = getNodes().filter(
          (n) => n.parentId === p.id && !updatedNodes.some((c) => c.id === n.id)
        );

        const children = [...updatedChildren, ...nonUpdatedChildren];
        const pSizings = computeGroupSizings(p, children);

        // update all children positions with the offset from pSizings
        children.forEach((c) => {
          const newPosition = {
            x: c.position.x + pSizings.offset.x,
            y: c.position.y + pSizings.offset.y,
          };
          if (updatedChildren.some((n) => n.id === c.id)) {
            updatedNodes.splice(
              updatedNodes.findIndex((n) => n.id === c.id),
              1,
              {
                ...c,
                position: newPosition,
              }
            );
          } else {
            updatedNodes.push({
              ...c,
              position: newPosition,
            });
          }
        });

        return {
          ...p,
          position: {
            x: pSizings.bounds.x,
            y: pSizings.bounds.y,
          },
          data: {
            ...p.data,
            isParent: children.length > 0,
            minWidth: pSizings.bounds.minWidth,
            minHeight: pSizings.bounds.minHeight,
          },
          style: {
            zIndex: -1,
          },
          width: pSizings.bounds.width,
          height: pSizings.bounds.height,
        };
      })
    );

    // finally update all nodes
    setNodes((nds) => {
      const updated = nds.map((n) => {
        const updatedNode = updatedNodes.find((u) => u.id === n.id);
        return updatedNode
          ? { ...updatedNode, dragging: false }
          : { ...n, dragging: false };
      });
      return updated;
    });
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onBeforeDelete,
  };
}
