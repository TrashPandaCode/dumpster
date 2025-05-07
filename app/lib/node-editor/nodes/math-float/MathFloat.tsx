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
import { COMPUTE, INPUTS, TYPES, type NumberInputType } from "./types";

const MathFloat = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [computeType, _setComputeType] = useState<string>(
    data.initialComputeType ?? "Addition"
  );
  const [inputState, setInputState] = useState<NumberInputType[]>(
    INPUTS[computeType ?? "Addition"]
  );
  const [xDisplayData, setxDisplayData] = useState(0);
  const [yDisplayData, setyDisplayData] = useState(0);

  function setComputeType(type: string): void {
    _setComputeType(type);
    setInputState(INPUTS[type]);
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
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeData) => {
        const x = getInput(inputs, IN_HANDLE_1, xInputData);
        const y = getInput(inputs, IN_HANDLE_2, yInputData);

        setxDisplayData(x);
        setyDisplayData(y);

        results.set(OUT_HANDLE_1, COMPUTE[computeType](x, y));
      },
    });
  }, [xInputData, yInputData, computeType]);

  return (
    <div className="min-w-3xs">
      <NodeContent label={computeType} type="float">
        <SelectDropDown
          items={TYPES}
          setSelected={setComputeType}
          defaultValue={computeType}
        />
        <br />
        <LabelHandle
          id={OUT_HANDLE_1}
          position={Position.Right}
          label="Result"
        />
        {inputState[0].enable && (
          <div className="text-left">
            {inputState[0].label}
            <NumberInput
              value={xDisplayData}
              setValue={setxInputData}
              defaultValue={0}
              disabled={!!xConnection.length}
              type={inputState[0].type}
            />
            <BaseHandle id={IN_HANDLE_1} position={Position.Left} />
          </div>
        )}
        {inputState[1].enable && (
          <div className="text-left">
            {inputState[1].label}
            <NumberInput
              value={yDisplayData}
              setValue={setyInputData}
              defaultValue={0}
              disabled={!!yConnection.length}
              type={inputState[1].type}
            />
            <BaseHandle id={IN_HANDLE_2} position={Position.Left} />
          </div>
        )}
      </NodeContent>
    </div>
  );
});

export default MathFloat;
