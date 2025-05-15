import { Handle, Position } from "@xyflow/react";

const ConnectorHandle = ({
  id,
  position,
}: {
  id: string;
  position: Position;
}) => {
  if (position == Position.Right) {
    return (
      <div>
        <Handle
          id={id}
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="!static float-right mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-full !bg-blue-300 !border-blue-300 text-[8px]"
        />
      </div>
    );
  } else if (position == Position.Left) {
    return (
      <div>
        <Handle
          id={id}
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="!static float-left mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-full !bg-blue-300 !border-blue-300 text-[8px]"
        />
      </div>
    );
  }
};

export default ConnectorHandle;
