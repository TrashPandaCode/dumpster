import { Handle, Position } from "@xyflow/react";

const ConnectorHandle = ({
  id,
  position,
}: {
  id: string;
  position: Position;
}) => {
  // TODO: simplify
  if (position == Position.Right) {
    return (
      <div>
        <Handle
          id={id}
          type="source"
          position={position}
          isConnectable={false}
          className="!static float-right mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-full !border-blue-300 !bg-blue-300 text-[8px]"
        />
      </div>
    );
  } else if (position == Position.Left) {
    return (
      <div>
        <Handle
          id={id}
          type="target"
          position={position}
          isConnectable={false}
          className="!static float-left mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-full !border-blue-300 !bg-blue-300 text-[8px]"
        />
      </div>
    );
  } else if (position == Position.Top) {
    return (
      <div>
        <Handle
          id={id}
          type="target"
          position={position}
          isConnectable={false}
          className="invisible"
        />
        <Handle
          id={id}
          type="source"
          position={position}
          isConnectable={false}
          className="invisible"
        />
      </div>
    );
  }
};

export default ConnectorHandle;
