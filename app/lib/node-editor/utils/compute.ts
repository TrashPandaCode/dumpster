/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This code offers a helper function to get the input of a node's output based on an input connection.
 * It is used to compute the node tree.
 */
import type { nodeInputs } from "../node-store/node-store";

export const getInput = (
  inputs: nodeInputs,
  handleId: string,
  fallback: number
) => {
  const input = inputs.get(handleId);
  return input?.sourceNode.getResult(input.sourceHandleId) ?? fallback;
};
