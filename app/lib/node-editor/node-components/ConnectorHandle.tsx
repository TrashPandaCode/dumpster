import { Handle, Position } from "@xyflow/react";

const ConnectorHandle = ({
  id,
  position,
}: {
  id: string;
  position: Position;
}) => {
  const handleConfig: Partial<Record<Position, { type: "source" | "target"; className: string }>> = {
    [Position.Right]: {
      type: "source" as const,
      className: "!static float-right mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-full !border-blue-300 !bg-blue-300 text-[8px]"
    },
    [Position.Left]: {
      type: "target" as const,
      className: "!static float-left mt-3 flex !h-3 !w-3 items-baseline justify-center !rounded-full !border-blue-300 !bg-blue-300 text-[8px]"
    }
  };

  const config = handleConfig[position];

  if (config) {
    return (
      <Handle
        id={id}
        type={config.type}
        position={position}
        isConnectable={false}
        className={config.className}
      />
    );
  }

  if (position === Position.Top) {
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

  return null;
};

export default ConnectorHandle;