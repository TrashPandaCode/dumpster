import { Handle, Position, useReactFlow } from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";

const Value = ({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, { value: 0 }); // write default value into node data
  }, []);

  const onChange = useCallback((evt: { target: { value: any } }) => {
    updateNodeData(id, { value: evt.target.value });
  }, []);

  return (
    <div>
      <Header>Float Value</Header>
      <Body>
        <div>
          <label htmlFor="value">Value: </label>
          <input
            id="value"
            type="number"
            onChange={onChange}
            className="nodrag"
            defaultValue={0}
          />
        </div>
        <Handle type="source" position={Position.Right} isConnectable={true} />
      </Body>
    </div>
  );
};

export default Value;
