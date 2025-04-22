import { Handle, Position } from "@xyflow/react";
import React, { useCallback } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";

const Add = () => {
  const [value, setValue] = React.useState(0);

  const onChange = useCallback(() => {
    const result = 10;
    setValue(result);
  }, []);
  return (
    <div>
      <Header>Addition (float)</Header>
      <Body>
        <div className="flex items-center gap-2">
          <div className="flex w-full flex-col">
            <div className="flex gap-2">
              <Handle
                id="x"
                type="target"
                position={Position.Left}
                className="!relative !top-3"
              />
              <label htmlFor="x">x</label>
              <input
                type="number"
                className="w-full"
                defaultValue={0}
                onChange={onChange}
              />
            </div>
            <div className="flex gap-2">
              <Handle
                id="y"
                type="target"
                position={Position.Left}
                className="!relative !top-3"
              />
              <label htmlFor="y">y</label>
              <input
                type="number"
                className="w-full"
                defaultValue={0}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="flex w-full justify-end gap-2">
            <label htmlFor="out">{value}</label>
            <Handle
              id="out"
              type="source"
              position={Position.Right}
              className="!relative !top-3"
            />
          </div>
        </div>
      </Body>
    </div>
  );
};

export default Add;
