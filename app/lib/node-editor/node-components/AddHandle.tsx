/*
 * Authors: Jonathan Kron, Milan Jezovsek
 *
 * Purpose:
 * This code offers a React component that lets users add handles to loops and gameobjects.
 */
import { PlusIcon } from "@radix-ui/react-icons";
import { useReactFlow } from "@xyflow/react";
import { useRef } from "react";

const AddHandle = ({
  handleIdentifiers,
  nodeId,
  initialLabel,
  addHandle,
}: {
  handleIdentifiers: string[];
  nodeId: string;
  initialLabel: string;
  addHandle: (handleIdentifier: string, label: string) => void;
}) => {
  const { updateNodeData } = useReactFlow();

  const handleLabel = useRef(initialLabel);
  const setHandleLabel = (label: string) => {
    handleLabel.current = label;
    updateNodeData(nodeId, { handleLabel: label });
  };

  const createHandle = () => {
    handleIdentifiers.forEach((handleIdentifier) =>
      addHandle(handleIdentifier, handleLabel.current)
    );
    setHandleLabel("");
  };

  return (
    <div className="relative mt-3 px-3">
      <input
        type="text"
        value={handleLabel.current}
        className="nodrag peer w-full rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
        placeholder="Handle Name"
        onChange={(evt) => {
          setHandleLabel(evt.target.value.replace("-", ""));
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
