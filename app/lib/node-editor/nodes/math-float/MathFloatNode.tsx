import {
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import SelectDropDown from "../../node-components/SelectDropDown";
import type {
  AppNode,
  nodeInputs,
  nodeResults,
} from "../../node-store/node-store";

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
  const yConnection = useNodeConnections({
    handleId: "input-y-handle",
    handleType: "target",
  });

  useEffect(() => {
    if (computeType) {
      updateNodeData(id, {
        compute: (inputs: nodeInputs, results: nodeResults) => {
          const xHandle = inputs.get("input-x-handle");
          const yHandle = inputs.get("input-y-handle");
          const x =
            xHandle?.sourceNode.getResult(xHandle.sourceHandleId) ?? xInputData;
          const y =
            yHandle?.sourceNode.getResult(yHandle.sourceHandleId) ?? yInputData;

          results.set("result-handle", x + y);
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
              id="result-handle"
              position={Position.Right}
              label="Result"
            />
            {inputEnable[0] && (
              <div className="text-left">
                x
                <NumberInput
                  value={69}
                  setValue={setxInputData}
                  defaultValue={0}
                  disabled={!!xConnection.length}
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
                  value={69}
                  setValue={setyInputData}
                  defaultValue={0}
                  disabled={!!yConnection.length}
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
