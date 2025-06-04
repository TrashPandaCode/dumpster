import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import AddHandle from "../../node-components/AddHandle";
import BaseHandle from "../../node-components/BaseHandle";
import ConnectorHandle from "../../node-components/ConnectorHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import { useLoopStore } from "../../node-store/loop-store";
import type {
  LoopStatus,
  nodeInputs,
  nodeResults,
} from "../../node-store/node-store";
import { getInput } from "../../utils";
import { IN_HANDLE_1, MAIN_LOOP_CONNECTOR, OUT_HANDLE_1 } from "../constants";

/**
 * React component representing the starting node of a "for" loop structure.
 *
 * - Allows the user to specify or input the number of loop iterations.
 * - Outputs the current loop index on each iteration.
 * - Manages loop variables which are passed between `ForStart` and `ForEnd`.
 * - Supports dynamic addition and removal of loop variables via handles.
 *
 * Props:
 * @param {string} id - Unique identifier for this node.
 * @param {any} data - Node data, including the `loopId` used for coordinating with loop state.
 * @param {boolean} selected - Whether the node is currently selected (used for UI styling).
 *
 * React Flow:
 * - Uses `useReactFlow` to register a compute function on mount.
 * - Uses `useNodeConnections` to determine if the iteration input is connected.
 *
 * Internal State:
 * - `iterations`: Ref holding the user-defined or connected iteration count.
 * - `iterDisplay`: State for displaying the current number of iterations.
 * - `curLabel`: Ref used for adding new loop variable handles.
 *
 * UI:
 * - Displays an input field for iteration count, optional connection input.
 * - Shows input/output handles for each loop variable.
 * - Includes a button to add new loop variables and icons to remove them.
 */

const ForStart = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const iterations = useRef(1);
    const [iterDisplay, setIterDisplay] = useState(1);

    const loops = useLoopStore((state) => state.loops);
    const addHandle = useLoopStore((state) => state.addHandle);
    const removeHandle = useLoopStore((state) => state.removeHandle);

    const curLabel = useRef("");

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
          const iters = Math.max(
            1,
            Math.round(getInput(inputs, IN_HANDLE_1, iterations.current))
          );
          setIterDisplay(iters);

          loops.get(data.loopId)?.forEach((handleId) => {
            results.set(
              handleId,
              loopStatus.iter === 0
                ? getInput(inputs, handleId, 0) // get data from nodes
                : loopStatus.loopResults.get(handleId)! // get data from for end node
            );
          });
          results.set(OUT_HANDLE_1, loopStatus.iter);
          if (loopStatus.iter === iters - 1) {
            loopStatus.looping = false;
          }
        },
        loopStart: true,
      });
    }, []);

    const iterConnection = useNodeConnections({
      handleId: IN_HANDLE_1,
      handleType: "target",
    });

    return (
      <div className="min-w-60">
        <NodeContent label="For Start" type="loop" docsName="forloop">
          <div className="text-left">
            Iterations
            <NumberInput
              value={iterDisplay}
              setValue={(v) => {
                if (v > 0) {
                  iterations.current = v;
                }
              }}
              defaultValue={iterations.current}
              disabled={!!iterConnection.length}
              type="int"
            />
            <BaseHandle id={IN_HANDLE_1} position={Position.Left} />
          </div>
          <ConnectorHandle id={MAIN_LOOP_CONNECTOR} position={Position.Right} />
          <LabelHandle
            id={OUT_HANDLE_1}
            position={Position.Right}
            label="Index"
          />
          {handles.map(([label, handleId]) => (
            <div
              className={
                "flex w-full items-center justify-between [&>*:nth-child(even)]:pointer-events-none [&>*:nth-child(even)]:opacity-0 hover:[&>*:nth-child(even)]:pointer-events-auto hover:[&>*:nth-child(even)]:opacity-100 " +
                (selected ? "hover:bg-slate-800" : "hover:bg-slate-700")
              }
              key={handleId}
            >
              <LabelHandle
                id={handleId}
                position={Position.Left}
                label={label}
              />
              <CrossCircledIcon
                className="cursor-pointer text-red-400"
                onClick={() => {
                  removeHandle(data.loopId, label);
                }}
              />
              <LabelHandle
                id={handleId}
                position={Position.Right}
                label={label}
              />
            </div>
          ))}
          <AddHandle
            addHandle={addHandle}
            handleIdentifiers={[data.loopId]}
            handleLabel={curLabel}
            nodeId={id}
            updateNodeData={updateNodeData}
          />
        </NodeContent>
      </div>
    );
  }
);

export default ForStart;
