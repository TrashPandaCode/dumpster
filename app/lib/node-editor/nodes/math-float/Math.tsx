import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useRef, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import SelectDropDown from "../../node-components/SelectDropDown";
import { type nodeData, type nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../utils";
import { IN_HANDLE_1, IN_HANDLE_2, OUT_HANDLE_1 } from "../constants";
import { COMPUTE, INPUTS, TYPES } from "./types";

/**
 * React component representing a math or logic operation node with one or two inputs and one output.
 *
 * - Allows the user to select a compute type (e.g., Addition, Subtraction).
 * - Dynamically configures the input fields based on the selected compute type.
 * - Computes the result from the input values using a predefined function map.
 * - Displays input fields that can be either manually editable or connected to upstream nodes.
 *
 * Props:
 * @param {string} id - Unique identifier for this node.
 * @param {any} data - Initial data for the node including optional input values and compute type.
 *
 * React Flow:
 * - Uses `useReactFlow` to register a compute function and update node data.
 * - Uses `useNodeConnections` to determine if input handles are connected.
 *
 * Internal State:
 * - `computeType`: The selected math operation (stored in a ref).
 * - `inputState`: UI configuration for enabled/disabled inputs.
 * - `xInputData`, `yInputData`: Refs holding raw input values.
 * - `xDisplayData`, `yDisplayData`: State used to display current inputs.
 */
const Math = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();

  const computeType = useRef(data.initialComputeType ?? "Addition");
  const [inputState, setInputState] = useState(
    INPUTS[computeType.current ?? "Addition"]
  );
  function setComputeType(type: string): void {
    computeType.current = type;
    updateNodeData(id, { initialComputeType: type });
    setInputState(INPUTS[type]);
  }

  const [xDisplayData, setxDisplayData] = useState(0);
  const [yDisplayData, setyDisplayData] = useState(0);

  const xInputData = useRef(data.xInputData ? data.xInputData.current : 0);
  const yInputData = useRef(data.yInputData ? data.yInputData.current : 0);

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
        const x = getInput(inputs, IN_HANDLE_1, xInputData.current);
        const y = getInput(inputs, IN_HANDLE_2, yInputData.current);

        setxDisplayData(x);
        setyDisplayData(y);

        results.set(OUT_HANDLE_1, COMPUTE[computeType.current](x, y));
      },
      xInputData,
      yInputData,
    });
  }, []);

  return (
    <div className="min-w-3xs">
      <NodeContent label={computeType.current} type="math" docsName="math">
        <SelectDropDown
          items={TYPES}
          setSelected={setComputeType}
          defaultValue={computeType.current}
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
              setValue={(v) => (xInputData.current = v)}
              defaultValue={xInputData.current}
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
              setValue={(v) => (yInputData.current = v)}
              defaultValue={yInputData.current}
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

export default Math;
