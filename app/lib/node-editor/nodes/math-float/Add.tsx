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

  // wirklich gottlos hässlig das hier
  // TODO: nochmal scharf nachdenken bevor wir das hier übernehmen
  // TODO: wenn man auf die pfeile im value feld klickt und weiter hovered dann saust der wert hoch/runter

  // TODO: allow for children in customhandle (which would then be the numberinput component)

  return (
    <div>
      <Header>Addition (float)</Header>
      <Body>
        <CustomHandle
          id="result-handle"
          label="Result"
          position={Position.Right}
          key={uuidv4()}
        />
        <CustomHandle
          id="input-x-handle"
          label=""
          position={Position.Left}
          key={uuidv4()}
        />
        <CustomHandle
          id="input-y-handle"
          label=""
          position={Position.Left}
          key={uuidv4()}
        />
      </Body>
    </div>
  );
};

export default Add;
