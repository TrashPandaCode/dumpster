import { useReactFlow, type Node, type OnNodeDrag } from "@xyflow/react";

import { useFlow } from "./useFlow";

export function useGroups() {
  const { getIntersectingNodes, getNode } = useReactFlow();
  const { setNodes } = useFlow();

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

  return { onNodeDragStop };
}
