import { PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { Panel } from "@xyflow/react";

const LeftPanel = () => {
  return (
    <Panel
      position="top-left"
      className="flex flex-col items-center justify-center gap-2"
    >
      <button className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900">
        <PlayIcon className="text-white" />
      </button>
      <button className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900">
        <ResetIcon className="text-white" />
      </button>
    </Panel>
  );
};

export default LeftPanel;
