import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import React, { memo, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import BaseHandle from "../../node-components/BaseHandle";
import Body from "../../node-components/Body";
import Header from "../../node-components/Header";
import LabelHandle from "../../node-components/LabelHandle";
import NumberInput from "../../node-components/NumberInput";

const Add = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [xInputData, setxInputData] = useState(0);
  const [yInputData, setyInputData] = useState(0);

  const xConnection = useNodeConnections({
    handleId: "input-x-handle",
    handleType: "target",
  });
  const xData = useNodesData(xConnection?.[0]?.source);

  const yConnection = useNodeConnections({
    handleId: "input-y-handle",
    handleType: "target",
  });
  const yData = useNodesData(yConnection?.[0]?.source);

  const result =
    Number(xData?.data ? (xData.data.value as number) : xInputData) +
    Number(yData?.data ? (yData.data.value as number) : yInputData);

  useEffect(() => {
    updateNodeData(id, { value: result });
  }, [result]);

  return (
    <div className="min-w-3xs">
      <Header>Addition</Header>
      <Body>
        <LabelHandle
          id="result-handle"
          position={Position.Right}
          key={uuidv4()}
          label="Result"
        />
        <div className="text-left">
          x
          <NumberInput
            setValue={setxInputData}
            defaultValue={0}
            disabled={xData?.data ? true : false}
          />
          <BaseHandle id="input-x-handle" position={Position.Left} />
        </div>
        <div className="text-left">
          y
          <NumberInput
            setValue={setyInputData}
            defaultValue={0}
            disabled={yData?.data ? true : false}
          />
          <BaseHandle id="input-y-handle" position={Position.Left} />
        </div>
      </Body>
    </div>
  );
});

export default Add;
