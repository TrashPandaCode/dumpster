import { Handle, Position } from "@xyflow/react";
import React, { useCallback } from "react";

const Value = () => {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div>
      <div>
        <label htmlFor="value">Value: </label>
        <input
          id="value"
          type="number"
          onChange={onChange}
          defaultValue={0}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </div>
  );
};

export default Value;
