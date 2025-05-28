import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ClipboardIcon,
  CopyIcon,
  CubeIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { Panel, useReactFlow, type ReactFlowInstance } from "@xyflow/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { useUIStore } from "~/lib/zustand/ui";
import { useNodeStore } from "../node-store/node-store";
import { MAIN_LOOP_CONNECTOR } from "../nodes/constants";
import { nodeTypes } from "../nodes/node-types";
import { IconButton } from "./IconButton";

const RightPanel: React.FC<{ rfInstance: ReactFlowInstance | undefined }> = ({
  rfInstance,
}) => {
  const {
    addNodes,
    addEdges,
    getNodes,
    getEdges,
    setViewport,
    setEdges,
    setNodes,
  } = useReactFlow();
  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const setOpenAddNodeDropdown = useUIStore((s) => s.setOpenAddNodeDropdown);

  return (
    <Panel
      position="top-right"
      className="flex flex-col items-end justify-center gap-2"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton side="left" tooltip="Add Node" aria-label="Add Node">
            <HamburgerMenuIcon className="text-white" />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            className="mt-2 flex w-65 flex-col items-center gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg !outline-1 !outline-slate-700"
            align="end"
          >
            {Object.keys(nodeTypes).map((name) => (
              <DropdownMenuItem asChild key={name}>
                <button
                  className="w-full cursor-pointer rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
                  onClick={() => {
                    addNodes({
                      id: uuidv4(),
                      type: name,
                      position: { x: 0, y: 0 },
                      data: {},
                    });
                  }}
                >
                  {name}
                </button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
                onClick={() => {
                  const startId = uuidv4();
                  const endId = uuidv4();
                  const loopId = uuidv4();
                  const edgeId = uuidv4();
                  addNodes([
                    {
                      id: startId,
                      type: "ForStart",
                      position: { x: 0, y: 0 },
                      data: { loopId },
                    },
                    {
                      id: endId,
                      type: "ForEnd",
                      position: { x: 300, y: 0 },
                      data: { loopId },
                    },
                  ]);
                  addEdges({
                    id: edgeId,
                    type: "straight",
                    source: startId,
                    target: endId,
                    sourceHandle: MAIN_LOOP_CONNECTOR,
                    targetHandle: MAIN_LOOP_CONNECTOR,
                    animated: true,
                    deletable: false,
                    selectable: false,
                    style: {
                      strokeWidth: 2,
                      stroke: "var(--color-blue-300)",
                    },
                  });
                }}
              >
                For Loop
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
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
