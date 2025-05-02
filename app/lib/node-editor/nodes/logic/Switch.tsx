import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import { type nodeData, type nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import {
  IN_HANDLE_1,
  IN_HANDLE_2,
  IN_HANDLE_3,
  OUT_HANDLE_1,
} from "../constants";

const Switch = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [yDisplayData, setyDisplayData] = useState(0);
  const [zDisplayData, setzDisplayData] = useState(0);

  const [yInputData, setyInputData] = useState(0);
  const [zInputData, setzInputData] = useState(0);

  const yConnection = useNodeConnections({
    handleId: IN_HANDLE_2,
    handleType: "target",
  });
  const zConnection = useNodeConnections({
    handleId: IN_HANDLE_3,
    handleType: "target",
  });

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeData) => {
        const x = getInput(inputs, IN_HANDLE_1, 0);
        const y = getInput(inputs, IN_HANDLE_2, yInputData);
        const z = getInput(inputs, IN_HANDLE_3, zInputData);

        setyDisplayData(y);
        setzDisplayData(z);

        results.set(OUT_HANDLE_1, x == 0 ? y : z);
      },
    });
  }, [yInputData, zInputData]);

  return (
    <div className="min-w-3xs">
      <NodeContent label="Switch" type="float">
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
            setValue={setyInputData}
            defaultValue={0}
            disabled={!!yConnection.length}
          />
          <BaseHandle id={IN_HANDLE_2} position={Position.Left} />
        </div>
        <div className="text-left">
          True
          <NumberInput
            value={zDisplayData}
            setValue={setzInputData}
            defaultValue={0}
            disabled={!!zConnection.length}
          />
          <BaseHandle id={IN_HANDLE_3} position={Position.Left} />
        </div>
      </NodeContent>
    </div>
  );
});

export default Switch;
