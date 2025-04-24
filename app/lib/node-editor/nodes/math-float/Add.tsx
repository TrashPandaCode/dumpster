import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Body from "../../node-components/Body";
import CustomHandle from "../../node-components/CustomHandle";
import Header from "../../node-components/Header";
import NumberInput from "../../node-components/NumberInput";

const Add = ({ id }: { id: string }) => {
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
    Number(yData?.data ? (yData?.data.value as number) : yInputData);

  useEffect(() => {
    updateNodeData(id, { value: result });
  }, [result]);

  // TODO: numbers don't show in NumberInput field, idk why
  // even though they compute

  return (
    <div>
      <Header>Addition (float)</Header>
      <Body>
        <CustomHandle
          id="result-handle"
          position={Position.Right}
          key={uuidv4()}
        >
          <span>Result</span>
        </CustomHandle>
        <CustomHandle
          id="input-x-handle"
          position={Position.Left}
          key={uuidv4()}
        >
          {!xData?.data && (
            <NumberInput setValue={setxInputData} defaultValue={0} />
          )}
        </CustomHandle>
        <CustomHandle
          id="input-y-handle"
          position={Position.Left}
          key={uuidv4()}
        >
          {!yData?.data && (
            <NumberInput setValue={setyInputData} defaultValue={0} />
          )}
        </CustomHandle>
      </Body>
    </div>
  );
};

export default Add;
