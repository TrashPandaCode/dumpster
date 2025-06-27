import { SizeIcon } from "@radix-ui/react-icons";
import { NodeResizeControl, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import NodeContent from "../../node-components/NodeContent";
import { INITIAL_GROUP_SIZE } from "../constants";

const controlStyle = {
  background: "transparent",
  border: "none",
};

/**
 * React component for a resizable "Group" node used to visually
 * group multiple nodes together in the node editor.
 *
 * Features:
 * - Resizable container using `NodeResizeControl` from `@xyflow/react`.
 * - Displays an editable "Group" label.
 * - Shows an icon (`SizeIcon`) in the bottom-right corner for resizing.
 *
 * Props:
 * @param {any} data - Configuration data for the group node:
 *   - `minWidth` / `minHeight`: Minimum resize constraints.
 *   - `isParent`: Indicates whether the group contains child nodes.
 *
 * Notes:
 * - This node acts as a visual and structural container only; no compute logic is applied.
 */
const Group = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [editLabel, setEditLabel] = useState(data.editLabel ?? "Group");

  useEffect(() => {
    updateNodeData(id, {
      editLabel,
    });
  }, [editLabel]);

  return (
    <>
      <NodeResizeControl
        style={controlStyle}
        minWidth={data.minWidth ?? INITIAL_GROUP_SIZE.width}
        minHeight={data.minHeight ?? INITIAL_GROUP_SIZE.height}
        className="relative"
      >
        <SizeIcon className="absolute right-2 bottom-2 rotate-90 cursor-nw-resize text-slate-400" />
      </NodeResizeControl>

      <NodeContent
        label={
          <input
            className="w-full rounded font-bold focus:outline-1 focus:outline-slate-500"
            value={editLabel}
            onChange={(e) => {
              setEditLabel(e.target.value);
            }}
          />
        }
        type="group"
        className="h-full bg-slate-900"
        docsName="group"
      >
        {!data.isParent && (
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
