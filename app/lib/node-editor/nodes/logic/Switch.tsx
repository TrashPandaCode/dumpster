import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import { type nodeInputs, type nodeResults } from "../../node-store/node-store";
import { getInput } from "../../utils/compute";
import {
  IN_HANDLE_1,
  IN_HANDLE_2,
  IN_HANDLE_3,
  OUT_HANDLE_1,
} from "../constants";

/**
 * React component representing a conditional switch node.
 *
 * - Outputs one of two input values based on a boolean condition.
 * - If the boolean input (IN_HANDLE_1) is `0`, it outputs the "False" value.
 * - If the boolean input is any non-zero value, it outputs the "True" value.
 *
 * Props:
 * @param {string} id - Unique identifier for this node.
 * @param {any} data - Node-specific data including default values for the "False" and "True" branches.
 *
 * React Flow:
 * - Uses `useReactFlow` to register the node's compute function on mount.
 * - Uses `useNodeConnections` to determine if input handles are connected.
 *
 * Internal State:
 * - `yInputData` (False value) and `zInputData` (True value) are stored in refs.
 * - Local display state for y and z values is updated after each compute call.
 *
 * UI:
 * - Displays one input for the condition and two inputs for result values.
 * - Disables manual input if a connection is present on that handle.
 */
const Switch = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [yDisplayData, setyDisplayData] = useState(0);
  const [zDisplayData, setzDisplayData] = useState(0);

  const [yInputData, setYInputData] = useState<number>(data.yInputData ?? 0);
  const [zInputData, setZInputData] = useState<number>(data.zInputData ?? 0);

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeResults) => {
        const x = getInput(inputs, IN_HANDLE_1, 0);
        const y = getInput(inputs, IN_HANDLE_2, yInputData);
        const z = getInput(inputs, IN_HANDLE_3, zInputData);

        setyDisplayData(y);
        setzDisplayData(z);

        results.set(OUT_HANDLE_1, x == 0 ? y : z);
      },
      yInputData,
      zInputData,
    });
  }, [yInputData, zInputData]);

  return (
    <div className="min-w-3xs">
      <NodeContent label="Switch" type="float" docsName="switch">
        <LabelHandle
          id={OUT_HANDLE_1}
          position={Position.Right}
          label="Result"
        />
        <LabelHandle label="bool" id={IN_HANDLE_1} position={Position.Left} />
        <div className="text-left">
          False
          <NumberInput
            value={yDisplayData}
            setValue={(v) => setYInputData(v)}
            defaultValue={yInputData}
            handleId={IN_HANDLE_2}
          />
          <BaseHandle id={IN_HANDLE_2} position={Position.Left} />
        </div>
        <div className="text-left">
          True
          <NumberInput
            value={zDisplayData}
            setValue={(v) => setZInputData(v)}
            defaultValue={zInputData}
            handleId={IN_HANDLE_3}
          />
          <BaseHandle id={IN_HANDLE_3} position={Position.Left} />
        </div>
      </NodeContent>
    </div>
  );
});

export default Switch;
