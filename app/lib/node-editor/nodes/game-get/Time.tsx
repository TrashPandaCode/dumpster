import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import { useTimeStore } from "~/lib/zustand/time";
import Body from "../../node-components/Body";
import Header from "../../node-components/Header";
import LabelHandle from "../../node-components/LabelHandle";
import NumberInput from "../../node-components/NumberInput";

const Time = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState(0);

  const time = useTimeStore((state) => state.time);

  useEffect(() => {
    setValue(time);
    updateNodeData(id, { value: value });
  }, [time]);

  return (
    <div className="min-w-48">
      <Header>Time</Header>
      <Body>
        <div className="flex w-full justify-end gap-2">
          <NumberInput value={value} setValue={setValue} defaultValue={0} disabled />
          <LabelHandle
            id="result-handle"
            position={Position.Right}
            label="Value"
          />
        </div>
      </Body>
    </div>
  );
});

export default Time;
