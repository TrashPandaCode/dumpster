import type { Node, NodeChange } from "@xyflow/react";

// This code is inspired by the `applyChanges` function from the xyflow library.
// https://github.com/xyflow/xyflow/blob/main/packages/react/src/utils/changes.ts/#L140

/*
 * This function applies changes to nodes or edges that are triggered by React Flow internally.
 * When you drag a node for example, React Flow will send a position change update.
 * This function then applies the changes and returns the updated elements.
 */
function applyChanges(changes: any[], elements: any[]): any[] {
  const updatedElements: any[] = [];
  /*
   * By storing a map of changes for each element, we can a quick lookup as we
   * iterate over the elements array!
   */
  const changesMap = new Map<any, any[]>();
  const addItemChanges: any[] = [];

  for (const change of changes) {
    if (change.type === "add") {
      addItemChanges.push(change);
      continue;
    } else if (change.type === "remove" || change.type === "replace") {
      /*
       * For a 'remove' change we can safely ignore any other changes queued for
       * the same element, it's going to be removed anyway!
       */
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);

      if (elementChanges) {
        /*
         * If we have some changes queued already, we can do a mutable update of
         * that array and save ourselves some copying.
         */
        elementChanges.push(change);
      } else {
        changesMap.set(change.id, [change]);
      }
    }
  }

  for (const element of elements) {
    const changes = changesMap.get(element.id);

    /*
     * When there are no changes for an element we can just push it unmodified,
     * no need to copy it.
     */
    if (!changes) {
      updatedElements.push(element);
      continue;
    }

    // If we have a 'remove' change queued, it'll be the only change in the array
    if (changes[0].type === "remove") {
      continue;
    }

    if (changes[0].type === "replace") {
      updatedElements.push({ ...changes[0].item });
      continue;
    }

    /**
     * For other types of changes, we want to start with a shallow copy of the
     * object so React knows this element has changed. Sequential changes will
     * each _mutate_ this object, so there's only ever one copy.
     */
    const updatedElement = { ...element };

    for (const change of changes) {
      applyChange(change, updatedElement);
    }

    updatedElements.push(updatedElement);
  }

  /*
   * we need to wait for all changes to be applied before adding new items
   * to be able to add them at the correct index
   */
  if (addItemChanges.length) {
    addItemChanges.forEach((change) => {
      if (change.index !== undefined) {
        updatedElements.splice(
          change.item.type === "Group" ? 0 : change.index, // if we add a group it is prepended
          0,
          { ...change.item }
        );
      } else {
        updatedElements.push({ ...change.item });
      }
    });
  }

  return updatedElements;
}

/**
 * Applies a single change to an element.
 * @param change - The change to apply.
 * @param element - The element to apply the change to.
 * @returns The updated element.
 */
function applyChange(change: any, element: any): any {
  switch (change.type) {
    case "select": {
      element.selected = change.selected;
      break;
    }

    case "position": {
      if (typeof change.position !== "undefined") {
        element.position = change.position;
      }

      if (typeof change.dragging !== "undefined") {
        element.dragging = change.dragging;
      }

      break;
    }

    case "dimensions": {
      if (typeof change.dimensions !== "undefined") {
        element.measured ??= {};
        element.measured.width = change.dimensions.width;
        element.measured.height = change.dimensions.height;

        if (change.setAttributes) {
          if (
            change.setAttributes === true ||
            change.setAttributes === "width"
          ) {
            element.width = change.dimensions.width;
          }
          if (
            change.setAttributes === true ||
            change.setAttributes === "height"
          ) {
            element.height = change.dimensions.height;
          }
        }
      }

      if (typeof change.resizing === "boolean") {
        element.resizing = change.resizing;
      }

      break;
    }
  }
}

/**
 * Drop in function that applies node changes to an array of nodes.
 * @public
 * @param changes - Array of changes to apply.
 * @param nodes - Array of nodes to apply the changes to.
 * @returns Array of updated nodes.
 * @example
 *```tsx
 *import { useState, useCallback } from 'react';
 *import { ReactFlow, applyNodeChanges, type Node, type Edge, type OnNodesChange } from '@xyflow/react';
 *
 *export default function Flow() {
 *  const [nodes, setNodes] = useState<Node[]>([]);
 *  const [edges, setEdges] = useState<Edge[]>([]);
 *  const onNodesChange: OnNodesChange = useCallback(
 *    (changes) => {
 *      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
 *    },
 *    [setNodes],
 *  );
 *
 *  return (
 *    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
 *  );
 *}
 *```
 * @remarks Various events on the <ReactFlow /> component can produce an {@link NodeChange}
 * that describes how to update the edges of your flow in some way.
 * If you don't need any custom behaviour, this util can be used to take an array
 * of these changes and apply them to your edges.
 */
export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange<NodeType>[],
  nodes: NodeType[]
): NodeType[] {
  return applyChanges(changes, nodes) as NodeType[];
}
