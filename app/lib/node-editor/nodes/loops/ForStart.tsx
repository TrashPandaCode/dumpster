import { CrossCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useRef, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import ConnectorHandle from "../../node-components/ConnectorHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import { useLoopStore } from "../../node-store/loop-store";
import type {
  LoopStatus,
  nodeData,
  nodeInputs,
} from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import { IN_HANDLE_1, LOOP_CONNECTOR_OUT, OUT_HANDLE_1 } from "../constants";

const ForStart = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const iterations = useRef(1); // iter = 0 => while;
    const [iterDisplay, setIterDisplay] = useState(1);

    const loops = useLoopStore((state) => state.loops);
    const addHandle = useLoopStore((state) => state.addHandle);
    const removeHandle = useLoopStore((state) => state.removeHandle);

    const curLabel = useRef("");

    const { updateNodeData } = useReactFlow();

    useEffect(() => {
      updateNodeData(id, {
        compute: (
          inputs: nodeInputs,
          results: nodeData,
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

    // we really need memoization for the handles!!!!
    // same for end node

    const iterConnection = useNodeConnections({
      handleId: IN_HANDLE_1,
      handleType: "target",
    });

    return (
      <div className="min-w-60">
        <NodeContent label="For Start" type="loop">
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
          <ConnectorHandle id={LOOP_CONNECTOR_OUT} position={Position.Right} />
          <LabelHandle
            id={OUT_HANDLE_1}
            position={Position.Right}
            label="Index"
          />
          {Array.from(loops.get(data.loopId) ?? []).map(([label, handleId]) => (
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
          <div className="relative mt-3 px-3">
            <input
              type="text"
              value={curLabel.current}
              className="nodrag peer w-full rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
              placeholder="Handle Name"
              onChange={(evt) => {
                curLabel.current = evt.target.value;
                updateNodeData(id, { curLabel });
              }}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") {
                  addHandle(data.loopId, curLabel.current);
                  curLabel.current = "";
                }
              }}
            />
            <PlusIcon
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 opacity-0 transition-opacity duration-100 peer-focus:opacity-100"
              onClick={() => {
                addHandle(data.loopId, curLabel.current);
                curLabel.current = "";
              }}
            />
          </div>
        </NodeContent>
      </div>
    );
  }
);

export default ForStart;
