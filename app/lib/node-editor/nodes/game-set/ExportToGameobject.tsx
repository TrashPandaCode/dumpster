import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import { IN_HANDLE_1, IN_HANDLE_2 } from "../constants";

const ExportToGameobject = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [curLabel, setCurLabel] = useState("");

  const [handles, setHandles] = useState<Map<string, string>>(
    new Map([
      ["xpos", IN_HANDLE_1],
      ["ypos", IN_HANDLE_2],
    ])
  ); //TODO: load this level based
  const setData = useDebugStore((state) => state.setData);

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, _: nodeData) => {
        handles.forEach((handleId, label) => {
          setData(label, handleId, getInput(inputs, handleId, 0));
        });
      },
    });
  }, [handles]);

  return (
    <div>
      <NodeContent label="Export To Gameobject" type="export">
        {Array.from(handles).map(([label, handleId]) => (
          <LabelHandle
            key={handleId}
            id={handleId}
            position={Position.Left}
            label={label}
          />
        ))}
        <div>
          <input
            type="text"
            className="nodrag ml-3 w-12 rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
            onChange={(evt) => {
              setCurLabel(evt.target.value);
            }}
          />
          <button
            className="ml-2 hover:cursor-pointer"
            onClick={() => {
              if (handles.has(curLabel)) return;
              const newHandles = new Map(handles);
              newHandles.set(curLabel, uuidv4());
              setHandles(newHandles);
            }}
          >
            +
          </button>
        </div>
      </NodeContent>
    </div>
  );
});

export default ExportToGameobject;
