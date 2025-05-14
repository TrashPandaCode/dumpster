import type { nodeInputs } from "./node-store";

export const getInput = (
  inputs: nodeInputs,
  handleId: string,
  fallback: number
) => {
  const input = inputs.get(handleId);
  return input?.sourceNode.getResult(input.sourceHandleId) ?? fallback;
};
