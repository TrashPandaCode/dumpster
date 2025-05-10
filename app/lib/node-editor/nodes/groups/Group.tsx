import { AllSidesIcon } from "@radix-ui/react-icons";
import { NodeResizeControl } from "@xyflow/react";
import React from "react";

import NodeContent from "../../node-components/NodeContent";

interface GroupProps {
  selected: boolean;
}

const controlStyle = {
  background: "transparent",
  border: "none",
};

const Group: React.FC<GroupProps> = ({ selected }) => {
  return (
    <>
      <NodeResizeControl
        style={controlStyle}
        minWidth={200}
        minHeight={150}
        className="relative"
      >
        <AllSidesIcon className="absolute right-2 bottom-2 cursor-pointer text-slate-400" />
      </NodeResizeControl>

      <NodeContent label="Group" type="group" isGroup>
        <div className="flex flex-col items-center justify-center p-2 opacity-60">
          <p className="text-xs italic">Drag and drop nodes here,</p>
          <p className="text-xs italic">to group them together.</p>
        </div>
      </NodeContent>
    </>
  );
};

export default Group;
