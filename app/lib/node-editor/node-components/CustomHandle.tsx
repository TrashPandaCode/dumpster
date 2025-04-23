import { Handle, Position } from "@xyflow/react";
import React, { type ReactNode } from "react";

// TODO: is this a good idea?
// TODO: all possibility for children for e.g. add node etc.

const CustomHandle = ({
  id,
  position,
  label,
}: {
  id: string;
  position: Position;
  label: string;
}) => {
  if (position == Position.Right) {
    return (
      <div className="text-right">
        {label}
        <Handle
          id={id}
          type="source"
          position={Position.Right}
          className="!static float-right mt-3.5"
        />
      </div>
    );
  } else if (position == Position.Left) {
    return (
      <div className="text-left">
        {label}
        <Handle
          id={id}
          type="target"
          position={Position.Left}
          className="!static float-left mt-3.5"
        />
      </div>
    );
  }
};

export default CustomHandle;
