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
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { Panel, useReactFlow } from "@xyflow/react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { nodeTypes } from "../nodes/node-types";

const AddNodePanel = () => {
  const { addNodes } = useReactFlow();

  return (
    <Panel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex size-[35px] items-center justify-center rounded-full border-2 bg-white hover:cursor-pointer focus:outline-hidden"
            aria-label="Customise options"
          >
            <HamburgerMenuIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5}>
            {Object.keys(nodeTypes).map((name) => {
              return (
                <DropdownMenuItem>
                  <button
                    onClick={() => {
                      addNodes({
                        id: uuidv4(),
                        type: name,
                        position: { x: 0, y: 0 },
                        data: { label: "" },
                      });
                    }}
                  >
                    {name}
                  </button>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </Panel>
  );
};

export default AddNodePanel;
