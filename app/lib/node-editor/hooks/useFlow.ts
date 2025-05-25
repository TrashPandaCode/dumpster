import {
  addEdge,
  applyEdgeChanges,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useNodeSetterStore } from "../node-store/node-setter";
import { useNodeStore } from "../node-store/node-store";
import { debugEdges } from "../solutions/debug";
import { applyNodeChanges, computeGroupSizings } from "../utils";

const selector = (state: {
  nodes: Node[];
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
  highlightDuplicateNodes: () => void;
}) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  highlightDuplicateNodes: state.highlightDuplicateNodes,
});

export function useFlow() {
  const { getIntersectingNodes, getNode, getNodes } = useReactFlow();
  const { nodes, setNodes, highlightDuplicateNodes } = useNodeSetterStore(
    useShallow(selector)
  );
  const [edges, setEdges] = useState<Edge[]>(debugEdges);

  const replaceNode = useNodeStore((state) => state.replaceNode);
  const removeNode = useNodeStore((state) => state.removeNode);
  const addEdgeStore = useNodeStore((state) => state.addEdge);
  const removeEdge = useNodeStore((state) => state.removeEdge);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      let handleHighlight = false;

      changes.forEach((element) => {
        switch (element.type) {
          case "add":
            replaceNode(element.item);
            handleHighlight = element.item.type === "ExportToGameobject";
            break;
          case "remove": {
            const node = getNode(element.id);
            if (node?.data.loopStart || node?.data.loopEnd) {
              const nodeOther = getNodes().filter(
                (n) => n.id !== element.id && n.data.loopId === node.data.loopId
              )[0];
              setNodes((nds) =>
                nds
                  .filter((n) => n.data.loopId !== node?.data.loopId)
                  .map((n) => ({
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
              setEdges((edgs) =>
                edgs.filter((edg) => {
                  if (
                    edg.target === nodeOther.id ||
                    edg.source === nodeOther.id
                  ) {
                    removeEdge(edg.id);
                    return false;
                  }
                  return true;
                })
              );

              removeNode(nodeOther.id);
            }
            removeNode(element.id);
            handleHighlight = true;
            break;
          }
          case "replace":
            replaceNode(element.item);
            handleHighlight = element.item.type === "ExportToGameobject";
            break;
        }
      });
      setNodes((nds) => applyNodeChanges(changes, nds));
      if (handleHighlight) {
        highlightDuplicateNodes();
      }
    },
    [
      setNodes,
      replaceNode,
      highlightDuplicateNodes,
      getNode,
      removeNode,
      getNodes,
      removeEdge,
    ]
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

        return false;
      };

      if (canConnect()) {
        addEdgeStore(connection);
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [setEdges, getNode, addEdgeStore]
  );

  const onNodeDragStop: OnNodeDrag = () => {
    const selectedNodes = nodes.filter((n) => n.selected && n.type !== "Group");
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
    const intersectingNodes = getIntersectingNodes(selectedBoundingRect).filter(
      (n) => n.type === "Group"
    );
    // choose Group with largest intersection area as new parent
    const newParentNode = intersectingNodes.reduce((largest, current) => {
      const currentArea = current.measured!.width! * current.measured!.height!;
      const largestArea = largest.measured!.width! * largest.measured!.height!;
      return currentArea > largestArea ? current : largest;
    }, selectedNodes[0]);

    const updatedNodes: Node[] = [];
    const parentsToUpdate: Node[] = [];
    selectedNodes.forEach((node) => {
      if (node.type === "Group") {
        return; // skip groups, they cant be nested
      }
      if (node.parentId === undefined && newParentNode.type === "Group") {
        // the node is an orphan and can be freely adopted into a new group
        updatedNodes.push({
          ...node,
          parentId: newParentNode.id,
          position: {
            x: node.position.x - newParentNode.position.x,
            y: node.position.y - newParentNode.position.y,
          },
          dragging: false,
        });
        if (!parentsToUpdate.includes(newParentNode)) {
          parentsToUpdate.push(newParentNode);
        }
      } else if (
        node.parentId !== undefined &&
        node.parentId !== newParentNode.id &&
        newParentNode.type === "Group"
      ) {
        // the node is open for adoption but paperwork with old parent is required
        const oldParentNode = getNode(node.parentId)!;
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
          dragging: false,
        });
        if (!parentsToUpdate.includes(newParentNode)) {
          parentsToUpdate.push(newParentNode);
        }
        if (!parentsToUpdate.includes(getNode(node.parentId)!)) {
          parentsToUpdate.push(getNode(node.parentId)!);
        }
      } else if (node.parentId === newParentNode.id) {
        // the node is only moving around in its family
        updatedNodes.push({
          ...node,
          dragging: false,
        });
        if (!parentsToUpdate.includes(newParentNode)) {
          parentsToUpdate.push(newParentNode);
        }
      } else {
        // the node is leaving home or never had one
        const oldParentNode = getNode(node.parentId!)!;
        updatedNodes.push({
          ...node,
          parentId: undefined,
          position: {
            x: node.position.x + getNode(node.parentId!)!.position.x,
            y: node.position.y + getNode(node.parentId!)!.position.y,
          },
          dragging: false,
        });
        if (!parentsToUpdate.includes(oldParentNode)) {
          parentsToUpdate.push(oldParentNode);
        }
      }
    });

    // update all parents
    console.log("updating", parentsToUpdate.length, "parent(s)");
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
      return nds.map((n) => {
        const updatedNode = updatedNodes.find((uN) => uN.id === n.id);
        if (updatedNode) {
          return updatedNode;
        }
        return n;
      });
    });
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
  };
}
