import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import { useTimeStore } from "~/lib/zustand/time";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";

const Time = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState(0);

  const time = useTimeStore((state) => state.time);

  useEffect(() => {
    setValue(time);
    updateNodeData(id, { "result-handle": value });
  }, [time]);

  return (
    <div className="min-w-48">
      <NodeContent label="Time" type="float">
        <div className="flex w-full justify-end gap-2">
          <NumberInput
            value={value}
            setValue={setValue}
            defaultValue={0}
            disabled
          />
          <LabelHandle
            id="result-handle"
            position={Position.Right}
            label="Value"
          />
        </div>
      </NodeContent>
    </div>
  );
});

export default Time;
