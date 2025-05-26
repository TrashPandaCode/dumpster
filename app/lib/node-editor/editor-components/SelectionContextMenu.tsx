import { Panel } from "@xyflow/react";
import React from "react";

import { useNodeActions } from "../hooks/useNodeActions";

type SelectionContextMenuProps = {
  nodeIds: string[];
  x: number;
  y: number;
  onClose: () => void;
};

const SelectionContextMenu: React.FC<SelectionContextMenuProps> = ({
  nodeIds,
  x,
  y,
  onClose,
}) => {
  const { duplicateNodes, deleteNodes } = useNodeActions();

  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <Panel className="flex w-44 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={() => {
            duplicateNodes(nodeIds);
            onClose();
          }}
        >
          Duplicate {nodeIds.length} nodes
        </button>
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={() => {
            deleteNodes(nodeIds);
            onClose();
          }}
        >
          Delete {nodeIds.length} nodes
        </button>
      </Panel>
    </div>
  );
};

export default SelectionContextMenu;
