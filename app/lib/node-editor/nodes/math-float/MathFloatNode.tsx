import {
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import SelectDropDown from "../../node-components/SelectDropDown";

const MathFloatNode = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [computeType, _setComputeType] = useState<string | null>(null);
  const [inputEnable, setInputEnable] = useState([true, true]);

  function setComputeType(type: string): void {
    _setComputeType(type);
    setInputEnable(INPUTS[type]);
  }

  const [xInputData, setxInputData] = useState(0);
  const [yInputData, setyInputData] = useState(0);

  const xConnection = useNodeConnections({
    handleId: "input-x-handle",
    handleType: "target",
  });
  const xData = useNodesData(xConnection[0]?.source);

  const yConnection = useNodeConnections({
    handleId: "input-y-handle",
    handleType: "target",
  });
  const yData = useNodesData(yConnection[0]?.source);

  useEffect(() => {
    if (computeType) {
      updateNodeData(id, {
        value: COMPUTE[computeType](
          Number(xData?.data ? (xData.data.value as number) : xInputData),
          Number(yData?.data ? (yData.data.value as number) : yInputData)
        ),
      });
    }
  }, [xInputData, yInputData, xData, yData, computeType]);

  return (
    <div className="min-w-3xs">
      <NodeContent
        label={computeType ? computeType : "Select Math Type"}
        type="float"
      >
        <SelectDropDown items={TYPES} setSelected={setComputeType} />
        {computeType && (
          <>
            <br />
            <LabelHandle
              id="result-handle"
              position={Position.Right}
              key={uuidv4()}
              label="Result"
            />
            {inputEnable[0] && (
              <div className="text-left">
                x
                <NumberInput
                  value={Number(xData?.data.value)}
                  setValue={setxInputData}
                  defaultValue={0}
                  disabled={!!xData?.data}
                />
                <BaseHandle
                  id="input-x-handle"
                  position={Position.Left}
                  isConnectable={xConnection.length < 1}
                />
              </div>
            )}
            {inputEnable[1] && (
              <div className="text-left">
                y
                <NumberInput
                  value={Number(yData?.data.value)}
                  setValue={setyInputData}
                  defaultValue={0}
                  disabled={!!yData?.data}
                />
                <BaseHandle
                  id="input-y-handle"
                  position={Position.Left}
                  isConnectable={yConnection.length < 1}
                />
              </div>
            )}
          </>
        )}
      </NodeContent>
    </div>
  );
});

export default MathFloatNode;

const TYPES = {
  Functions: ["Addition", "Substraction", "Multiply", "Divide"],
  Trigonometric: ["Sine"],
};

const INPUTS: { [key: string]: boolean[] } = {
  Addition: [true, true],
  Substraction: [true, true],
  Multiply: [true, true],
  Divide: [true, true],
  Sine: [true, false],
};

const COMPUTE: { [key: string]: (x: number, y: number) => number } = {
  Addition: (x, y) => x + y,
  Substraction: (x, y) => x - y,
  Multiply: (x, y) => x * y,
  Divide: (x, y) => x / y,
  Sine: (x, _) => Math.sin(x),
};
