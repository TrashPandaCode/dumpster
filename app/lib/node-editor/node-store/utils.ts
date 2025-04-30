import type { nodeInputs } from "./node-store";

export const getInput = (
  inputs: nodeInputs,
  handle: string,
  fallback: number
) => {
  const input = inputs.get(handle);
  return input?.sourceNode.getResult(input.sourceHandleId) ?? fallback;
};
