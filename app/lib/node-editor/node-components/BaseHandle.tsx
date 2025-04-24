import { Handle, Position } from "@xyflow/react";
import React from "react";

const BaseHandle = ({ id, position }: { id: string; position: Position }) => {
  if (position == Position.Right) {
    return (
      <Handle
        id={id}
        type="source"
        position={Position.Right}
        className="!static float-right mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-[2px] !border-emerald-300 text-[8px]"
      />
    );
  } else if (position == Position.Left) {
    return (
      <Handle
        id={id}
        type="target"
        position={Position.Left}
        className="!static float-left mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-[2px] !border-emerald-300 text-[8px]"
      />
    );
  }
};

export default BaseHandle;
