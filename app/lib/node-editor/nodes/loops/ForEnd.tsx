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
import { IN_HANDLE_1, OUT_HANDLE_1 } from "../constants";

const ForEnd = memo(({ id, data }: { id: string; data: any }) => {
  const loops = useLoopStore((state) => state.loops);

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, {
      compute: (
        inputs: nodeInputs,
        results: nodeData,
        loopStatus: LoopStatus
      ) => {
        loops.get(data.loopId)?.forEach((handleId) => {
          const input = getInput(inputs, handleId, 0);
          results.set(handleId, input);
          loopStatus.loopResults.set(handleId, input);
        });
        loopStatus.iter++;
        if (+getInput(inputs, IN_HANDLE_1, 0)) loopStatus.looping = false;
      },
      loopEnd: true,
    });
  }, []);

  // if one of the nodes is deleted the other one should be removed too
  // we could always filter for a node with the same nodeId on delete
  // or disallow delete and wrap both nodes with a group
  // and only the group can be deleted idk fitler is prob better

  return (
    <div className="min-w-48">
      <NodeContent label="For End" type="loop">
        <LabelHandle id={IN_HANDLE_1} label="Break" position={Position.Left} />
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
      </NodeContent>
    </div>
  );
});

export default ForEnd;
