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

const MathFloat = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [computeType, _setComputeType] = useState<string | null>(
    data.initialComputeType ?? null
  );
  const [inputEnable, setInputEnable] = useState<NumberInputType[]>(
    INPUTS[computeType ?? "Addition"]
  );
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
        <SelectDropDown
          items={TYPES}
          setSelected={setComputeType}
          defaultValue={computeType ?? ""}
        />
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
                  type={inputEnable[0]}
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
                  type={inputEnable[1]}
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

export default MathFloat;

export type NumberInputType = undefined | "float" | "int";

const TYPES = {
  Functions: [
    "Addition",
    "Substraction",
    "Multiply",
    "Divide",
    "Power",
    "Logarithm",
    "Absolute",
  ],
  Rounding: ["Round", "Floor", "Ceil", "Modulo"],
  Trigonometric: ["Sine", "Cosine", "Tangent"],
  Conversion: ["To Radians", "To Degrees"],
  Compare: ["Equals", "Greater Than", "Less Than"],
};

const INPUTS: { [key: string]: NumberInputType[] } = {
  Addition: ["float", "float"],
  Substraction: ["float", "float"],
  Multiply: ["float", "float"],
  Divide: ["float", "float"],
  Power: ["float", "float"],
  Logarithm: ["float", undefined],
  Absolute: ["float", undefined],

  Round: ["float", "int"],
  Floor: ["float", undefined],
  Ceil: ["float", undefined],
  Modulo: ["float", "float"],

  Sine: ["float", undefined],
  Cosine: ["float", undefined],
  Tangent: ["float", undefined],

  "To Radians": ["float", undefined],
  "To Degrees": ["float", undefined],

  Equals: ["float", "float"],
  "Greater Than": ["float", "float"],
  "Less Than": ["float", "float"],
};

const COMPUTE: { [key: string]: (x: number, y: number) => number } = {
  Addition: (x, y) => x + y,
  Substraction: (x, y) => x - y,
  Multiply: (x, y) => x * y,
  Divide: (x, y) => x / y,
  Power: (x, y) => Math.pow(x, y),
  Logarithm: (x, _) => Math.log(x),
  Absolute: (x, _) => Math.abs(x),

  Round: (x, y) =>
    Math.round((x + Number.EPSILON) * Math.pow(10, y)) / Math.pow(10, y),
  Floor: (x, _) => Math.floor(x),
  Ceil: (x, _) => Math.ceil(x),
  Modulo: (x, y) => x % y,

  Sine: (x, _) => Math.sin(x),
  Cosine: (x, _) => Math.cos(x),
  Tangent: (x, _) => Math.tan(x),

  "To Radians": (x, _) => x * (Math.PI / 180),
  "To Degree": (x, _) => x * (180 / Math.PI),

  Equals: (x, y) => +(x == y),
  "Greater Than": (x, y) => +(x > y),
  "Less Than": (x, y) => +(x < y),
};
