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
import { applyNodeChanges } from "../utils";

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

    // get child node position in global coords
    let childNodeGlobalPosition = childNode.position;
    if (childNode.parentId) {
      const parent =
        childNode.parentId === parentNode.id
          ? parentNode
          : getNode(childNode.parentId)!;

      childNodeGlobalPosition = {
        x: childNode.position.x + parent.position.x,
        y: childNode.position.y + parent.position.y,
      };
    }

    // new parent node position
    const offset = 20;
    const offsetX = parentNode.position.x - childNodeGlobalPosition.x + offset;
    const offsetY = parentNode.position.y - childNodeGlobalPosition.y + offset;

    const parentPosition = {
      x: parentNode.position.x - Math.max(offsetX, 0),
      y: parentNode.position.y - Math.max(offsetY, 0),
    };

    let parentWidth = parentNode.measured!.width! + Math.max(offsetX, 0);
    let parentHeight = parentNode.measured!.height! + Math.max(offsetY, 0);

    // new child position
    const childPosition = {
      x: childNodeGlobalPosition.x - parentPosition.x,
      y: childNodeGlobalPosition.y - parentPosition.y,
    };

    // new parent width based on child position
    const widthChild = childPosition.x + childNode.measured!.width! + 20;
    const heightChild = childPosition.y + childNode.measured!.height! + 20;

    // expand parent if new width is greater
    parentWidth = Math.max(widthChild, parentWidth);
    parentHeight = Math.max(heightChild, parentHeight);

    setNodes((nds) =>
      nds.map((n) => {
        // apply changes to the child and parent node
        if (n.id === childNode.id) {
          return {
            ...n,
            parentId: parentNode.id,
            position: childPosition,
          };
        } else if (n.id === parentNode.id) {
          return {
            ...n,
            position: parentPosition,
            width: parentWidth,
            height: parentHeight,
            data: { isParent: true },
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
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
  };
}
