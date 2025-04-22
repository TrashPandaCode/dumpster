import { Handle, Position } from "@xyflow/react";
import React, { useCallback } from "react";

const Add = () => {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div>
      <Handle type="target" position={Position.Top} isConnectable={true} />
      <div>
        <label htmlFor="add-value">Add Value: </label>
        <input
          id="add-value"
          type="number"
          onChange={onChange}
          defaultValue={0}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={true} />
    </div>
  );
};

export default Add;
