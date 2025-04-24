import { Position, useKeyPress, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";
import LabelHandle from "../../node-components/LabelHandle";

const KeyPress = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const spacePressed = useKeyPress("d");

  useEffect(() => {
    updateNodeData(id, { value: +spacePressed });
  }, [spacePressed]);

  return (
    <div className="min-w-48">
      <Header>KeyPress (Test)</Header>
      <Body>
        <div className="flex w-full justify-end gap-2">
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

export default KeyPress;
