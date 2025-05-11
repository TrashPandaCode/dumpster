import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useRef, useState } from "react";

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

const Switch = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [yDisplayData, setyDisplayData] = useState(0);
  const [zDisplayData, setzDisplayData] = useState(0);

  const yInputData = useRef(data.yInputData ? data.yInputData.current : 0);
  const zInputData = useRef(data.zInputData ? data.zInputData.current : 0);

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
        const y = getInput(inputs, IN_HANDLE_2, yInputData.current);
        const z = getInput(inputs, IN_HANDLE_3, zInputData.current);

        setyDisplayData(y);
        setzDisplayData(z);

        results.set(OUT_HANDLE_1, x == 0 ? y : z);
      },
      yInputData,
      zInputData,
    });
  }, []);

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
            setValue={(v) => (yInputData.current = v)}
            defaultValue={yInputData.current}
            disabled={!!yConnection.length}
          />
          <BaseHandle id={IN_HANDLE_2} position={Position.Left} />
        </div>
        <div className="text-left">
          True
          <NumberInput
            value={zDisplayData}
            setValue={(v) => (zInputData.current = v)}
            defaultValue={zInputData.current}
            disabled={!!zConnection.length}
          />
          <BaseHandle id={IN_HANDLE_3} position={Position.Left} />
        </div>
      </NodeContent>
    </div>
  );
});

export default Switch;
