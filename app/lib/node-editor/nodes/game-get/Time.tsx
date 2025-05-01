import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import { useTimeStore } from "~/lib/zustand/time";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1, OUT_HANDLE_2 } from "../constants";

const Time = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const time = useTimeStore((state) => state.time);
  const deltaTime = useTimeStore((state) => state.deltaTime);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        results.set(OUT_HANDLE_1, time);
        results.set(OUT_HANDLE_2, deltaTime);
      },
    });
  }, [time]);

  return (
    <div className="min-w-48">
      <NodeContent label="Time" type="float">
        <div className="flex w-full justify-end gap-2">
          <NumberInput
            value={time}
            setValue={() => {}}
            defaultValue={0}
            disabled
          />
          <LabelHandle
            id={OUT_HANDLE_1}
            position={Position.Right}
            label="Time"
          />
        </div>
        <div className="flex w-full justify-end gap-2">
          <NumberInput
            value={deltaTime}
            setValue={() => {}}
            defaultValue={0}
            disabled
          />
          <LabelHandle
            id={OUT_HANDLE_2}
            position={Position.Right}
            label="Delta time"
          />
        </div>
      </NodeContent>
    </div>
  );
});

export default Time;
