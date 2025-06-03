import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeInputs, nodeResults } from "../../node-store/node-store";
import { getInput } from "../../utils";
import { IN_HANDLE_1 } from "../constants";

/**
 * React component representing a node that displays all incoming data.
 *
 * Props:
 * @param {string} id - Unique identifier for this node instance.
 *
 */
const Display = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [displaNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, _: nodeResults) => {
        setDisplayNumber(getInput(inputs, IN_HANDLE_1, 0));
      },
    });
  }, []);

  return (
    <div className="min-w-48">
      <NodeContent label="Display" type="debug" docsName="display">
        <div className="flex gap-2">
          <LabelHandle id={IN_HANDLE_1} position={Position.Left} />
          <p>{displaNumber}</p>
        </div>
      </NodeContent>
    </div>
  );
});

export default Display;
