import { SizeIcon } from "@radix-ui/react-icons";
import { NodeResizeControl } from "@xyflow/react";
import { memo } from "react";

import NodeContent from "../../node-components/NodeContent";
import { GROUP_SIZE } from "../constants";

const controlStyle = {
  background: "transparent",
  border: "none",
};

const Group = memo(({ data }: { data: any }) => {
  return (
    <>
      <NodeResizeControl
        style={controlStyle}
        minWidth={data.minWidth ?? GROUP_SIZE.width}
        minHeight={data.minHeight ?? GROUP_SIZE.height}
        className="relative"
      >
        <SizeIcon className="absolute right-2 bottom-2 rotate-90 cursor-nw-resize text-slate-400" />
      </NodeResizeControl>

      <NodeContent
        label="Group"
        type="group"
        className="h-full bg-slate-900"
        docsName="group"
      >
        {!data.isParent && ( // TODO: the hint doesn't come back after all nodes are removed, do we event want this?
          <div className="flex flex-col items-center justify-center p-2 text-xs italic opacity-60">
            <p>Drag and drop nodes here,</p>
            <p>to group them together.</p>
          </div>
        )}
      </NodeContent>
    </>
  );
});

export default Group;
