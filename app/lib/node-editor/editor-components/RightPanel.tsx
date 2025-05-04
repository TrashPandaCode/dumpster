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
import { memo } from "react";
import { v4 as uuidv4 } from "uuid";

import { useNodeStore } from "../node-store/node-store";
import { nodeTypes } from "../nodes/node-types";

const RightPanel = memo(() => {
  const { addNodes } = useReactFlow();
  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);

  return (
    <Panel
      position="top-right"
      className="flex flex-col items-end justify-center gap-2"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900 data-[state=open]:rounded-b-none data-[state=open]:bg-slate-800 data-[state=open]:outline-none"
            aria-label="Customise options"
          >
            <HamburgerMenuIcon className="text-white" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            className="flex w-65 flex-col items-center space-y-2 rounded rounded-tr-none bg-slate-800 p-2 pt-2 pb-2 shadow-lg outline outline-slate-500 outline-solid"
            align="end"
          >
            {Object.keys(nodeTypes).map((name, index) => {
              return index === 0
                ? [
                    <DropdownMenuItem
                      key={"add_node_dropdown_" + index}
                      className="w-62 rounded pr-4 pl-2 hover:bg-slate-700"
                    >
                      <button
                        className="text-left text-sm text-white"
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
                    </DropdownMenuItem>,
                  ]
                : [
                    <DropdownMenuSeparator
                      className="h-px w-[95%] bg-slate-700"
                      key={`sep-${index}`}
                    />,
                    <DropdownMenuItem
                      key={"add_node_dropdown_" + index}
                      className="w-62 rounded pr-4 pl-2 hover:bg-slate-700"
                    >
                      <button
                        className="text-left text-sm text-white"
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
                    </DropdownMenuItem>,
                  ];
            })}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <button
        onClick={nodeStateDebugPrint}
        className="cursor-pointer rounded bg-slate-800 p-2 text-white outline outline-slate-500 hover:bg-slate-900"
      >
        <CubeIcon className="text-white" />
      </button>
    </Panel>
  );
});

export default RightPanel;
