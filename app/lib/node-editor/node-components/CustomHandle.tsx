import { Handle, Position } from "@xyflow/react";
import React, { type ReactNode } from "react";

const CustomHandle = ({
  id,
  position,
  children,
}: {
  id: string;
  position: Position;
  children: ReactNode;
}) => {
  if (position == Position.Right) {
    return (
      <div className="text-right">
        {children}
        <Handle
          id={id}
          type="source"
          position={Position.Right}
          className="!static float-right mt-3"
        />
      </div>
    );
  } else if (position == Position.Left) {
    return (
      <div className="text-left">
        {children}
        <Handle
          id={id}
          type="target"
          position={Position.Left}
          className="!static float-left mt-3"
        />
      </div>
    );
  }
};

export default CustomHandle;
