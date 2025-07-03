/*
 * Authors: Jonathan Kron, Leo Kling
 *
 * Purpose:
 * This code provides undo and redo functions that update the flow store's history and synchronize the node store by resetting and replacing its nodes and edges accordingly.
 */
import { useFlowStore } from "../node-store/flow-store";
import { useNodeStore } from "../node-store/node-store";

export function undo() {
  useFlowStore.temporal.getState().undo();
  updateNodeStore();
}

export function redo() {
  useFlowStore.temporal.getState().redo();
  updateNodeStore();
}

function updateNodeStore() {
  const state = useFlowStore.getState();
  state.resetHighlight("cycle");

  // update the node store (by replacing all nodes and edges)
  const nodeStoreState = useNodeStore.getState();
  nodeStoreState.reset();

  state.nodes.forEach((node) => {
    nodeStoreState.replaceNode(node);
  });

  state.edges.forEach((edge) => {
    nodeStoreState.addEdge(edge);
  });
}
