import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import { useEffect, useState } from "react";

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
    <div className="min-w-3xs">
      <Header>Addition</Header>
      <Body>
        <CustomHandle id="result-handle" position={Position.Right}>
          <span>Result</span>
        </CustomHandle>
        <CustomHandle id="input-x-handle" position={Position.Left}>
          <></>
        </CustomHandle>

        <div className="flex w-full items-center justify-between gap-2 px-3">
          <span className="flex-1">x</span>
          <span>
            =
            <NumberInput setValue={setxInputData} defaultValue={0} disabled={!!xData?.data} />
          </span>
        </div>

        <CustomHandle id="input-y-handle" position={Position.Left}>
          <></>
        </CustomHandle>
        {!yData?.data && (
          <NumberInput setValue={setyInputData} defaultValue={0} />
        )}
      </Body>
    </div>
  );
};

export default Add;
