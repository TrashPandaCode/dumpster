import { PlusIcon } from "@radix-ui/react-icons";
import type { Node } from "@xyflow/react";
import React from "react";

const AddHandle = ({
  handleIdentifier,
  handleLabel,
  nodeId,
  updateNodeData,
  addHandle,
}: {
  handleIdentifier: string;
  handleLabel: React.RefObject<string>;
  nodeId: string;
  updateNodeData: (
    id: string,
    dataUpdate:
      | Partial<Record<string, unknown>>
      | ((node: Node) => Partial<Record<string, unknown>>),
    options?: {
      replace: boolean;
    }
  ) => void;
  addHandle: (handleIdentifier: string, label: string) => void;
}) => {
  const createHandle = () => {
    addHandle(handleIdentifier, handleLabel.current);
    handleLabel.current = "";
  };
  return (
    <div className="relative mt-3 px-3">
      <input
        type="text"
        value={handleLabel.current}
        className="nodrag peer w-full rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
        placeholder="Handle Name"
        onChange={(evt) => {
          handleLabel.current = evt.target.value;
          updateNodeData(nodeId, { curLabel: handleLabel });
        }}
        onKeyDown={(evt) => {
          if (evt.key === "Enter") {
            createHandle();
          }
        }}
      />
      <PlusIcon
        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400"
        onClick={() => {
          createHandle();
        }}
      />
    </div>
  );
};

export default AddHandle;
