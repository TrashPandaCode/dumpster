import { Handle, Position } from "@xyflow/react";
import React, { useCallback, useState } from "react";

const Value = () => {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
    setValue(evt.target.value);
  }, []);
  const [value, setValue] = useState(0);
  return (
    <div>
      <div>
        <label htmlFor="value">Value: </label>
        <input
          id="value"
          type="number"
          onChange={onChange}
          //defaultValue={0}
          className="nodrag"
          value={value}
        />
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </div>
  );
};

export default Value;
