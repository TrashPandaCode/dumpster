import { Handle, Position } from "@xyflow/react";
import { type ReactNode } from "react";

const CustomHandle = ({
  id,
  position,
  children,
  type
}: {
  id: string;
  position: Position;
  children: ReactNode;
  type: "float" | "vector";
}) => {
  const letter = type == "float" ? "f" : "v";
  if (position == Position.Right) {
    return (
      <div className="text-right">
        {children}
        <Handle
          id={id}
          type="source"
          position={Position.Right}
          className="!static float-right mt-3 text-[8px] flex justify-center items-baseline !w-3 !h-3 !rounded-[2px] !border-emerald-300"
        >{letter}</Handle>
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
          className="!static float-left mt-3 text-[8px] flex justify-center items-baseline !w-3 !h-3 !rounded-[2px] !border-emerald-300"
        >{letter}</Handle>
      </div>
    );
  }
};

export default CustomHandle;
