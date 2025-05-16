import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CubeIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Panel, useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

import { useNodeStore } from "../node-store/node-store";
import { MAIN_LOOP_CONNECTOR } from "../nodes/constants";
import { nodeTypes } from "../nodes/node-types";

const RightPanel = () => {
  const { addNodes, addEdges, getNodes } = useReactFlow();
  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);

  return (
    <Panel
      position="top-right"
      className="flex flex-col items-end justify-center gap-2"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900 data-[state=open]:bg-slate-900"
            aria-label="Customise options"
          >
            <HamburgerMenuIcon className="text-white" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            className="flex w-65 flex-col items-center gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg !outline-1 !outline-slate-700"
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
          <button
            onClick={nodeStateDebugPrint}
            className="cursor-pointer rounded bg-slate-800 p-2 text-white outline outline-slate-500 hover:bg-slate-900"
          >
            <CubeIcon className="text-white" />
          </button>
          <button
            onClick={() => {
              console.log(getNodes());
            }}
            className="cursor-pointer rounded bg-slate-800 p-2 text-white outline outline-slate-500 hover:bg-slate-900"
          >
            <CubeIcon className="text-white" />
          </button>
        </>
      )}
    </Panel>
  );
};

export default RightPanel;
