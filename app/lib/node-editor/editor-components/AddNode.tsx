import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { Panel, useReactFlow } from "@xyflow/react";
import React, { memo } from "react";
import { v4 as uuidv4 } from "uuid";

import { nodeTypes } from "../nodes/node-types";

const AddNodePanel = memo(() => {
  const { addNodes } = useReactFlow();

  return (
    <Panel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex size-[35px] items-center justify-center rounded border-2 bg-white hover:cursor-pointer focus: border-none
            data-[state=open]:bg-slate-800 data-[state=open]:text-white data-[state=open]:rounded-b-none"
            aria-label="Customise options"
          >
            <HamburgerMenuIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent className="flex flex-col items-center space-y-2 rounded rounded-tl-none   bg-slate-800 p-2 shadow-lg pt-2 pb-2  w-65 outline-5 outline-solid outline-slate-700"
              sideOffset={0} align={"start"}>
            {Object.keys(nodeTypes).map((name, index) => {
              return index === 0 ?[
                  <DropdownMenuItem key={"add_node_dropdown_" + index} className="hover:bg-slate-700 rounded pl-2 pr-4 w-62">
                    <button
                      className="text-white text-sm text-left"
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
              ]
              : [
                <DropdownMenuSeparator className="bg-slate-700 w-[95%] h-px"key={`sep-${index}`} />,
                <DropdownMenuItem key={"add_node_dropdown_" + index} className="hover:bg-slate-700 rounded pl-2 pr-4 w-62">
                <button
                  className="text-white text-sm text-left"
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
              ];
            })}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </Panel>
  );
});

export default AddNodePanel;
