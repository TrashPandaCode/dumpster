import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import React, { memo, useEffect, useRef } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import { useLoopStore } from "../../node-store/loop-store";
import type {
  LoopStatus,
  nodeData,
  nodeInputs,
} from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import { OUT_HANDLE_1, OUT_HANDLE_2 } from "../constants";

const testIterations = 5; // iter = 0 => while;

const ForStart = memo(({ id, data }: { id: string; data: any }) => {
  const loops = useLoopStore((state) => state.loops);
  const addHandle = useLoopStore((state) => state.addHandle);

  const curLabel = useRef("");

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, {
      compute: (
        inputs: nodeInputs,
        results: nodeData,
        loopStatus: LoopStatus
      ) => {
        loops.get(data.loopId)?.forEach((handleId) => {
          results.set(
            handleId,
            loopStatus.iter === 0
              ? getInput(inputs, handleId, 0) // get data from nodes
              : loopStatus.loopResults.get(handleId)! // get data from for end node
          );
        });
        results.set(OUT_HANDLE_1, loopStatus.iter);
        if (loopStatus.iter === testIterations - 1) {
          loopStatus.looping = false;
        }
      },
      loopStart: true,
    });
  }, []);

  // we really need memoization for the handles!!!!
  // same for end node

  return (
    <div className="min-w-48">
      <NodeContent label="For Start" type="loop">
        <LabelHandle
          id={OUT_HANDLE_2}
          position={Position.Right}
          label="DEBUG"
        />
        <LabelHandle
          id={OUT_HANDLE_1}
          position={Position.Right}
          label="Index"
        />
        {Array.from(loops.get(data.loopId) ?? []).map(([label, handleId]) => (
          <LabelHandle
            key={handleId}
            id={handleId}
            position={Position.Right}
            label={label}
          />
        ))}
        {Array.from(loops.get(data.loopId) ?? []).map(([label, handleId]) => (
          <LabelHandle
            key={handleId}
            id={handleId}
            position={Position.Left}
            label={label}
          />
        ))}
        <div>
          <input
            type="text"
            value={curLabel.current}
            className="nodrag ml-3 w-12 rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
            onChange={(evt) => {
              curLabel.current = evt.target.value;
              updateNodeData(id, { curLabel });
            }}
          />
          <button
            className="ml-2 hover:cursor-pointer"
            onClick={() => {
              addHandle(data.loopId, curLabel.current);
            }}
          >
            +
          </button>
        </div>
      </NodeContent>
    </div>
  );
});

export default ForStart;
