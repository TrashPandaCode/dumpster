import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";

const Add = ({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [xInputData, setxInputData] = useState(0);
  const [yInputData, setyInputData] = useState(0);

  const xConnection = useNodeConnections({
    handleId: "x",
    handleType: "target",
  });
  const xData = useNodesData(xConnection?.[0]?.source);
  const yConnection = useNodeConnections({
    handleId: "y",
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

  return (
    <div>
      <Header>Addition (float)</Header>
      <Body>
        <div className="flex items-center gap-2">
          <div className="flex w-full flex-col">
            <div className="flex gap-2">
              <Handle
                id="x"
                type="target"
                position={Position.Left}
                className="!relative !top-3"
              />
              <label htmlFor="x">x</label>
              <input
                type="number"
                className="w-full"
                value={xInputData}
                onChange={(evt) => {
                  setxInputData(Number(evt.target.value));
                }}
              />
            </div>
            <div className="flex gap-2">
              <Handle
                id="y"
                type="target"
                position={Position.Left}
                className="!relative !top-3"
              />
              <label htmlFor="y">y</label>
              <input
                type="number"
                className="w-full"
                value={yInputData}
                onChange={(evt) => {
                  setyInputData(Number(evt.target.value));
                }}
              />
            </div>
          </div>

          <div className="flex w-full justify-end gap-2">
            <Handle
              id="out"
              type="source"
              position={Position.Right}
              className="!relative !top-3"
            />
            <label htmlFor="out">{result}</label>
          </div>
        </div>
      </Body>
    </div>
  );
};

export default Add;
