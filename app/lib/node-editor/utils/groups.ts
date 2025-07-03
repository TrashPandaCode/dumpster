/*
 * Authors:
 *
 * Purpose:
 */
import type { Node } from "@xyflow/react";

import { INITIAL_GROUP_SIZE } from "../nodes/constants";

export function computeGroupSizings(parentNode: Node, childNodes: Node[]) {
  if (childNodes.length === 0) {
    return {
      bounds: {
        x: parentNode.position.x,
        y: parentNode.position.y,
        width: INITIAL_GROUP_SIZE.width,
        height: INITIAL_GROUP_SIZE.height,
        minWidth: INITIAL_GROUP_SIZE.width,
        minHeight: INITIAL_GROUP_SIZE.height,
      },
      offset: { x: 0, y: 0 },
    };
  }

  // get the child nodes positions in global coords
  const childNodesGlobalPositions = childNodes.map((child) => {
    return {
      x: child.parentId
        ? child.position.x + parentNode.position.x
        : child.position.x,
      y: child.parentId
        ? child.position.y + parentNode.position.y
        : child.position.y,
      width: child.measured!.width!,
      height: child.measured!.height!,
    };
  });

  // get all extreme coords of positions of child nodes
  const childExtremas = {
    x: {
      min: Math.min(...childNodesGlobalPositions.map((pos) => pos.x)),
      max: Math.max(
        ...childNodesGlobalPositions.map((pos) => pos.x + pos.width)
      ),
    },
    y: {
      min: Math.min(...childNodesGlobalPositions.map((pos) => pos.y)),
      max: Math.max(
        ...childNodesGlobalPositions.map((pos) => pos.y + pos.height)
      ),
    },
  };

  // caculate a bounding box around the child positions in form of an origin point on the top left and a width and height
  const childBounds = {
    x: childExtremas.x.min - 20,
    y: childExtremas.y.min - 60,
    width: childExtremas.x.max - childExtremas.x.min + 40,
    height: childExtremas.y.max - childExtremas.y.min + 80,
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
    width:
      Math.max(
        childBounds.x + childBounds.width,
        parentBounds.x + parentBounds.width
      ) - Math.min(childBounds.x, parentBounds.x),
    height:
      Math.max(
        childBounds.y + childBounds.height,
        parentBounds.y + parentBounds.height
      ) - Math.min(childBounds.y, parentBounds.y),
    minWidth: Math.max(
      childBounds.x +
        childBounds.width -
        Math.min(childBounds.x, parentBounds.x),
      INITIAL_GROUP_SIZE.width
    ),
    minHeight: Math.max(
      childBounds.y +
        childBounds.height -
        Math.min(childBounds.y, parentBounds.y),
      INITIAL_GROUP_SIZE.height
    ),
  };

  // offset the children by the difference of the parent node position and the new parent node position
  // this is needed to keep the child nodes in the same position relative to the parent node
  const childNodeOffset = {
    x: parentNode.position.x - newParentBounds.x,
    y: parentNode.position.y - newParentBounds.y,
  };

  return {
    bounds: newParentBounds,
    offset: childNodeOffset,
  };
}
