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

  const onNodeDragStopNew: OnNodeDrag = () => {
    const draggedNonGroupNodes = getNodes().filter((node) => node.dragging && node.type !== "Group");
    if (draggedNonGroupNodes.length === 0) return;

    const parentNode = getIntersectingNodes(draggedNonGroupNodes[0])?.[0];
    if (!parentNode || parentNode.type !== "Group") {
      const nodesWithParent = draggedNonGroupNodes.filter(
        (node) => node.parentId !== undefined
      );
      if (nodesWithParent.length === 0) return;
      setNodes((nds) =>
        nds.map((n) => {
          if (nodesWithParent.some((node) => node.id === n.id)) {
            const oldParent = nodes.find((p) => p.id === n.parentId);

            const position = {
              x: n.position.x + (oldParent ? oldParent.position.x : 0),
              y: n.position.y + (oldParent ? oldParent.position.y : 0),
            };

            return {
              ...n,
              position,
              parentId: undefined,
              dragging: false,
            };
          }
          return n;
        })
      );
    }

    // add all remaining nodes to the parent node
    const updatedNodes = draggedNonGroupNodes.map((node) => {
      const oldParent = getNodes().find((n) => n.id === node.parentId);

      const position = {
        x: node.position.x + (oldParent ? oldParent.position.x : 0) - parentNode.position.x,
        y: node.position.y + (oldParent ? oldParent.position.y : 0) - parentNode.position.y,
      };

      return {
        ...node,
        position,
        parentId: parentNode.id,
        dragging: false,
      };
    });

    setNodes((nds) =>
      nds.map((node) => {
        const updatedNode = updatedNodes.find((n) => n.id === node.id);
        if (updatedNode) {
          return updatedNode;
        }
        return node;
      })
    )
  };


  const onNodeDragStop: OnNodeDrag = (_, childNode) => {
    // if the node is a group, return
    // node nesting cant work because of weird react flow behavior
    // "parent nodes need to be in front of child nodes in node array"
    if (childNode.type === "Group") return;

    const parentNode = getIntersectingNodes(childNode)?.[0];

    // if there are no overlapping nodes but node has a parentid or
    // if the overlapping node is not a group, remove the node from the group it is in
    if ((!parentNode || parentNode.type !== "Group") && childNode.parentId) {
      setNodes((nds) =>
        nds.map((n) => {
          // look for and update the corresponding node with the new position and remove the parentId
          if (n.id === childNode.id) {
            const parent = nds.find((p) => p.id === childNode.parentId);

            // if parent is not found, return the node unmodified
            // ... highly unlikely
            if (!parent) return n;

            // add the parent position to the node position so the node position is relative to the editor again
            const position = {
              x: n.position.x + parent.position.x,
              y: n.position.y + parent.position.y,
            };

            // return the modified node
            return {
              ...n,
              position,
              parentId: undefined,
              dragging: false,
            };
          }

          // return all other nodes unmodified
          return n;
        })
      );
      return;
    }

    // if there are no overlapping nodes, return
    if (!parentNode) return;

    // if overlapping node is not a group, return
    if (parentNode.type !== "Group") return;

    // get all child nodes of the parent node
    const children = getNodes().filter(
      (n) => n.parentId === parentNode.id
    );
    if(!children.some((child) => child.id === childNode.id)) {
      children.push(childNode)
    }

    const parentSizings = computeGroupSizings(parentNode, children);

    const newParentBounds = parentSizings.newParentBounds;
    const childNodeOffset = parentSizings.childNodeOffset;

    setNodes((nds) =>
      nds.map((n) => {
        // apply changes to the child and parent node
        if (n.id === childNode.id) {
          return {
            ...n,
            parentId: parentNode.id,
            position: {
              x: childNode.parentId === undefined ? n.position.x - newParentBounds.x : n.position.x + childNodeOffset.x,
              y: childNode.parentId === undefined ? n.position.y - newParentBounds.y : n.position.y + childNodeOffset.y,
            },
            dragging: false,
          };

        } else if (n.parentId === parentNode.id) {
          return {
            ...n,
            position: {
              x: n.position.x + childNodeOffset.x,
              y: n.position.y + childNodeOffset.y,
            },
            dragging: false,
          };
        } else if (n.id === parentNode.id) {
          return {
            ...n,
            position: {
              x: newParentBounds.x,
              y: newParentBounds.y,
            },
            width: newParentBounds.width,
            height: newParentBounds.height,
            data: { isParent: true, minWidth: newParentBounds.minWidth, minHeight: newParentBounds.minHeight },
            style: { zIndex: -1 },
            dragging: false,
          };
        }
        // return all other nodes unmodified
        return n;
      })
    );
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
