import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import ConnectorHandle from "../../node-components/ConnectorHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import { useLoopStore } from "../../node-store/loop-store";
import type {
  LoopStatus,
  nodeData,
  nodeInputs,
} from "../../node-store/node-store";
import { getInput } from "../../utils";
import { IN_HANDLE_1, MAIN_LOOP_CONNECTOR } from "../constants";

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
        if (+getInput(inputs, IN_HANDLE_1, 0)) loopStatus.looping = false;
        loopStatus.iter++;
      },
      loopEnd: true,
    });
  }, []);

  return (
    <div className="min-w-60">
      <NodeContent label="For End" type="loop">
        <ConnectorHandle id={MAIN_LOOP_CONNECTOR} position={Position.Left} />
        <LabelHandle id={IN_HANDLE_1} label="Break" position={Position.Left} />
        {Array.from(loops.get(data.loopId) ?? []).map(([label, handleId]) => (
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
