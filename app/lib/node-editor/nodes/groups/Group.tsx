import { SizeIcon } from "@radix-ui/react-icons";
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
        <SizeIcon className="absolute right-2 bottom-2 rotate-90 cursor-pointer text-slate-400" />
      </NodeResizeControl>

      <NodeContent label="Group" type="group" className="h-full bg-slate-900">
        <div className="flex flex-col items-center justify-center p-2 text-xs italic opacity-60">
          <p>Drag and drop nodes here,</p>
          <p>to group them together.</p>
        </div>
      </NodeContent>
    </>
  );
};

export default Group;
