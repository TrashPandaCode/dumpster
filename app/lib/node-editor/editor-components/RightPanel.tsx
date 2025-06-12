import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ClipboardIcon,
  CopyIcon,
  CubeIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Panel, useReactFlow, type ReactFlowInstance } from "@xyflow/react";
import { useState } from "react";

import { useFlowStore } from "../node-store/flow-store";
import { globalKeyTracker } from "~/lib/game/utils/globalKeyTracker";
import { useNodeStore } from "../node-store/node-store";
import AddNodes from "./AddNodes";
import HelpMenu from "./HelpMenu";
import { IconButton } from "./IconButton";

const RightPanel: React.FC<{ rfInstance: ReactFlowInstance | undefined }> = ({
  rfInstance,
}) => {
  const { getNodes, getEdges, setViewport, setEdges, setNodes } =
    useReactFlow();

  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Panel
      position="top-right"
      className="flex flex-col items-end justify-center gap-2"
    >
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <IconButton
            id="add-nodes"
            side="left"
            tooltip={
              <p>
                Add Node
                <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
                  {globalKeyTracker.isMac ? "⌥+Space" : "Ctrl+Space"}
                </span>
              </p>
            }
            aria-label="Add Node"
          >
            <PlusIcon className="text-white" />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <AddNodes
              onClose={() => setIsDropdownOpen(false)}
              x={1800}
              y={400}
            />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <HelpMenu />

      {process.env.NODE_ENV === "development" && (
        <>
          <IconButton
            onClick={nodeStateDebugPrint}
            side="left"
            tooltip="Print Node State"
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Nodes"
            side="left"
            onClick={() => {
              console.log(getNodes());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Edges"
            side="left"
            onClick={() => {
              console.log(getEdges());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Temporal State"
            side="left"
            onClick={() => {
              console.log(useFlowStore.temporal.getState());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Copy State"
            side="left"
            onClick={() => {
              const flow = rfInstance?.toObject();
              navigator.clipboard.writeText(JSON.stringify(flow));
            }}
          >
            <CopyIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Paste State"
            side="left"
            onClick={async () => {
              const flow = JSON.parse(await navigator.clipboard.readText());

              if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes);
                setEdges(flow.edges);
                setViewport({ x, y, zoom });
              }
            }}
          >
            <ClipboardIcon className="text-white" />
          </IconButton>
        </>
      )}
    </Panel>
  );
};

export default RightPanel;
