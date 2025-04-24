import { Handle, Position } from "@xyflow/react";
import { type ReactNode } from "react";

const CustomHandle = ({
  id,
  position,
  children,
  type,
}: {
  id: string;
  position: Position;
  children?: ReactNode;
  type: "float" | "vector" | "any";
}) => {
  const letter = type == "float" ? "f" : type == "vector" ? "v" : "a";
  if (position == Position.Right) {
    return (
      <div className="text-right">
        {children}
        <Handle
          id={id}
          type="source"
          position={Position.Right}
          className="!static float-right mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-[2px] !border-emerald-300 text-[8px]"
        >
          {letter}
        </Handle>
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
          className="!static float-left mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-[2px] !border-emerald-300 text-[8px]"
        >
          {letter}
        </Handle>
      </div>
    );
  }
};

export default CustomHandle;
