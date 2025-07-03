/*
 * Authors: Jonathan Kron, Milan Jezovsek
 *
 * Purpose:
 * React component representing a math or logic operation node with one or two inputs and one output.
 */
import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import SelectDropDown from "../../node-components/SelectDropDown";
import { type nodeInputs, type nodeResults } from "../../node-store/node-store";
import { getInput } from "../../utils/compute";
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

  const [computeType, setComputeType] = useState<string>(
    data.initialComputeType ?? "Addition"
  );
  const inputState = INPUTS[computeType];

  const [xDisplayData, setxDisplayData] = useState(0);
  const [yDisplayData, setyDisplayData] = useState(0);

  const [xInputData, setXInputData] = useState<number>(data.xInputData ?? 0);
  const [yInputData, setYInputData] = useState<number>(data.yInputData ?? 0);

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeResults) => {
        const x = getInput(inputs, IN_HANDLE_1, xInputData);
        const y = getInput(inputs, IN_HANDLE_2, yInputData);

        setxDisplayData(x);
        setyDisplayData(y);

        results.set(OUT_HANDLE_1, COMPUTE[computeType](x, y));
      },
      xInputData,
      yInputData,
      initialComputeType: computeType,
    });
  }, [computeType, xInputData, yInputData]);

  return (
    <div className="min-w-3xs">
      <NodeContent label={computeType} type="math" docsName="math">
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
              setValue={(v) => setXInputData(v)}
              defaultValue={xInputData}
              handleId={IN_HANDLE_1}
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
              setValue={(v) => setYInputData(v)}
              defaultValue={yInputData}
              handleId={IN_HANDLE_2}
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
