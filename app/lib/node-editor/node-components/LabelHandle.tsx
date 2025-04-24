import { Handle, Position } from "@xyflow/react";

import BaseHandle from "./BaseHandle";

const LabelHandle = ({
  id,
  position,
  label,
}: {
  id: string;
  position: Position;
  label?: string;
}) => {
  if (position == Position.Right) {
    return (
      <div className="text-right">
        {label}
        <BaseHandle id={id} position={position} />
      </div>
    );
  } else if (position == Position.Left) {
    return (
      <div className="text-left">
        {label}
        <BaseHandle id={id} position={position} />
      </div>
    );
  }
};

export default LabelHandle;
