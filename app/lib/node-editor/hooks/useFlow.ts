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

import { useNodeStore } from "../node-store/node-store";
import { debugEdges, debugNodes } from "../solutions/debug";
import { applyNodeChanges } from "../utils";

export function useFlow() {
  const { getIntersectingNodes, getNode, getNodes } = useReactFlow();
  const [nodes, setNodes] = useState<Node[]>(debugNodes);
  const [edges, setEdges] = useState<Edge[]>(debugEdges);

  const replaceNode = useNodeStore((state) => state.replaceNode);
  const removeNode = useNodeStore((state) => state.removeNode);
  const addEdgeStore = useNodeStore((state) => state.addEdge);
  const removeEdge = useNodeStore((state) => state.removeEdge);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((element) => {
        switch (element.type) {
          case "add":
            replaceNode(element.item);
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
            break;
          }
          case "replace":
            replaceNode(element.item);
            break;
        }
      });

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes, getNode, getNodes, setEdges, replaceNode, removeNode, removeEdge]
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

    // get the child nodes positions in global coords
    const childNodesGlobalPositions = children.map((child) => {
      return {
        x: child.parentId ? child.position.x + parentNode.position.x : child.position.x,
        y: child.parentId ? child.position.y + parentNode.position.y : child.position.y,
        width: child.measured!.width!,
        height: child.measured!.height!,
      };
    });

    // get all extreme coords of positions of child nodes
    const childExtremas = {
      x: {
        min: Math.min(
          ...childNodesGlobalPositions.map((pos) => pos.x)
        ),
        max: Math.max(
          ...childNodesGlobalPositions.map((pos) => pos.x + pos.width)
        ),
      },
      y: {
        min: Math.min(
          ...childNodesGlobalPositions.map((pos) => pos.y)
        ),
        max: Math.max(
          ...childNodesGlobalPositions.map((pos) => pos.y + pos.height)
        ),
      },
    };

    // caculate a bounding box around the child positions in form of an origin point on the top left and a width and height
    const childBounds = {
      x: childExtremas.x.min - 20,
      y: childExtremas.y.min - 30,
      width: childExtremas.x.max - childExtremas.x.min + 40,
      height: childExtremas.y.max - childExtremas.y.min + 50,
    };

    const parentBounds = {
      x: parentNode.position.x,
      y: parentNode.position.y,
      width: parentNode.measured!.width!,
      height: parentNode.measured!.height!,
    };

    const newParentBounds = {
      x: Math.min(childBounds.x, parentBounds.x),
      y: Math.min(childBounds.y, parentBounds.y),
      width: Math.max(
        childBounds.x + childBounds.width, parentBounds.x + parentBounds.width
      ) - Math.min(childBounds.x, parentBounds.x),
      height: Math.max(
        childBounds.y + childBounds.height, parentBounds.y + parentBounds.height
      ) - Math.min(childBounds.y, parentBounds.y),
      minWidth: (childBounds.x + childBounds.width) - Math.min(childBounds.x, parentBounds.x),
      minHeight: (childBounds.y + childBounds.height) - Math.min(childBounds.y, parentBounds.y),
    };

    // offset the children by the difference of the parent node position and the new parent node position
    // this is needed to keep the child nodes in the same position relative to the parent node
    const childNodeOffset = {
      x: parentNode.position.x - newParentBounds.x,
      y: parentNode.position.y - newParentBounds.y,
    };

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
          };

        } else if (n.parentId === parentNode.id) {
          return {
            ...n,
            position: {
              x: n.position.x + childNodeOffset.x,
              y: n.position.y + childNodeOffset.y,
            },
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
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
  };
}
