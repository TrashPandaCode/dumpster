/*
 * Authors: Jonathan Kron, Milan Jezovsek
 *
 * Purpose:
 * React component representing the end node of a "for" loop structure.
 */
import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useMemo } from "react";

import ConnectorHandle from "../../node-components/ConnectorHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import { useLoopStore } from "../../node-store/loop-store";
import type {
  LoopStatus,
  nodeInputs,
  nodeResults,
} from "../../node-store/node-store";
import { getInput } from "../../utils/compute";
import { IN_HANDLE_1, MAIN_LOOP_CONNECTOR } from "../constants";

/**
 * React component representing the end node of a "for" loop structure.
 *
 * - Finalizes loop execution by copying input values to outputs.
 * - Optionally breaks the loop early if the "Break" input is truthy.
 * - Increments the loop iteration counter.
 *
 * Props:
 * @param {string} id - Unique identifier for this node.
 * @param {any} data - Data object containing metadata, particularly `loopId` used to identify the loop.
 *
 * React Flow:
 * - Uses `useReactFlow` to register a compute function via `updateNodeData`.
 * - Uses `useLoopStore` to access and manipulate loop-related shared state.
 *
 * UI:
 * - Displays labeled input/output handles for all variables passed through the loop.
 * - Includes a special "Break" input and a loop connector.
 */
const ForEnd = memo(({ id, data }: { id: string; data: any }) => {
  const loops = useLoopStore((state) => state.loops);

  const { updateNodeData } = useReactFlow();
  const handles = useMemo(
    () => Array.from(loops.get(data.loopId) ?? []),
    [data.loopId, loops]
  );

  useEffect(() => {
    updateNodeData(id, {
      compute: (
        inputs: nodeInputs,
        results: nodeResults,
        loopStatus: LoopStatus
      ) => {
        loops.get(data.loopId)?.forEach((handleId) => {
          const input = getInput(inputs, handleId, 0);
          results.set(handleId, input);
          loopStatus.loopResults.set(handleId, input);
        });
        if (+getInput(inputs, IN_HANDLE_1, 0)) loopStatus.looping = false;
        loopStatus.iter++;
      },
      loopEnd: true,
    });
  }, []);

  return (
    <div className="min-w-60">
      <NodeContent label="For End" type="loop" docsName="forloop">
        <ConnectorHandle id={MAIN_LOOP_CONNECTOR} position={Position.Left} />
        <LabelHandle id={IN_HANDLE_1} label="Break" position={Position.Left} />
        {handles.map(([label, handleId]) => (
          <div
            className={"flex w-full items-center justify-between"}
            key={handleId}
          >
            <LabelHandle
              key={handleId + "in"}
              id={handleId}
              position={Position.Left}
              label={label}
            />
            <LabelHandle
              key={handleId + "out"}
              id={handleId}
              position={Position.Right}
              label={label}
            />
          </div>
        ))}
      </NodeContent>
    </div>
  );
});

export default ForEnd;
