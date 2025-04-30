import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import SelectDropDown from "../../node-components/SelectDropDown";
import { type nodeData, type nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import { IN_HANDLE_1, IN_HANDLE_2, OUT_HANDLE_1 } from "../constants";

const MathFloatNode = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [computeType, _setComputeType] = useState<string | null>(null);
  const [inputEnable, setInputEnable] = useState([true, true]);
  const [xDisplayData, setxDisplayData] = useState(0);
  const [yDisplayData, setyDisplayData] = useState(0);

  function setComputeType(type: string): void {
    _setComputeType(type);
    setInputEnable(INPUTS[type]);
  }

  const [xInputData, setxInputData] = useState(0);
  const [yInputData, setyInputData] = useState(0);

  const xConnection = useNodeConnections({
    handleId: IN_HANDLE_1,
    handleType: "target",
  });
  const yConnection = useNodeConnections({
    handleId: IN_HANDLE_2,
    handleType: "target",
  });

  useEffect(() => {
    if (computeType) {
      updateNodeData(id, {
        compute: (inputs: nodeInputs, results: nodeData) => {
          const x = getInput(inputs, IN_HANDLE_1, xInputData);
          const y = getInput(inputs, IN_HANDLE_2, yInputData);

          setxDisplayData(x);
          setyDisplayData(y);

          results.set(OUT_HANDLE_1, COMPUTE[computeType](x, y));
        },
      });
    }
  }, [xInputData, yInputData, computeType]);

  return (
    <div className="min-w-3xs">
      <NodeContent label={computeType ?? "Select Math Type"} type="float">
        <SelectDropDown items={TYPES} setSelected={setComputeType} />
        {computeType && (
          <>
            <br />
            <LabelHandle
              id={OUT_HANDLE_1}
              position={Position.Right}
              label="Result"
            />
            {inputEnable[0] && (
              <div className="text-left">
                x
                <NumberInput
                  value={xDisplayData}
                  setValue={setxInputData}
                  defaultValue={0}
                  disabled={!!xConnection.length}
                />
                <BaseHandle
                  id={IN_HANDLE_1}
                  position={Position.Left}
                  isConnectable={xConnection.length < 1}
                />
              </div>
            )}
            {inputEnable[1] && (
              <div className="text-left">
                y
                <NumberInput
                  value={yDisplayData}
                  setValue={setyInputData}
                  defaultValue={0}
                  disabled={!!yConnection.length}
                />
                <BaseHandle
                  id={IN_HANDLE_2}
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
