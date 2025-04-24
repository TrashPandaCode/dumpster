import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Position, useKeyPress, useReactFlow } from "@xyflow/react";
import classnames from "classnames";
import React, { memo, useEffect, useState } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";
import LabelHandle from "../../node-components/LabelHandle";

const KeyPress = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [curKey, setCurKey] = useState("");
  const keyPressed = useKeyPress(curKey);

  useEffect(() => {
    updateNodeData(id, { value: +keyPressed });
  }, [keyPressed]);

  return (
    <div className="min-w-48">
      <Header>KeyPress (Test)</Header>
      <Body>
        <div className="flex w-full justify-end gap-2">
          <SelectPrimitive.Select>
            <SelectPrimitive.SelectTrigger
              className="nodrag text-md mx-3 flex flex-1 items-baseline rounded-sm border border-slate-700 bg-slate-900 px-1 text-white focus:border-slate-500 focus:outline-none"
              aria-label="Key"
            >
              <SelectPrimitive.SelectValue placeholder="..." />
              <SelectPrimitive.SelectIcon className="ml-auto text-white">
                <ChevronDownIcon />
              </SelectPrimitive.SelectIcon>
            </SelectPrimitive.SelectTrigger>

            <SelectPrimitive.SelectPortal>
              <SelectPrimitive.SelectContent className="overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-md">
                <SelectPrimitive.SelectScrollUpButton className="flex h-[25px] items-center justify-center bg-slate-900 text-white">
                  <ChevronUpIcon />
                </SelectPrimitive.SelectScrollUpButton>
                <SelectPrimitive.SelectViewport className="p-1">
                  <SelectPrimitive.SelectGroup>
                    <SelectPrimitive.Label className="px-2 font-mono text-xs text-white">
                      Keys
                    </SelectPrimitive.Label>
                    <SelectItem value="w">W</SelectItem>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                    <SelectItem value="e">E</SelectItem>
                    <SelectItem value="f">F</SelectItem>

                    <SelectPrimitive.Label className="px-2 font-mono text-xs text-white">
                      Arrows
                    </SelectPrimitive.Label>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="up">Up</SelectItem>
                    <SelectItem value="down">Down</SelectItem>

                    <SelectPrimitive.Label className="px-2 font-mono text-xs text-white">
                      Other
                    </SelectPrimitive.Label>
                    <SelectItem value=" ">Space</SelectItem>
                    <SelectItem value="enter">Enter</SelectItem>

                    
                  </SelectPrimitive.SelectGroup>
                </SelectPrimitive.SelectViewport>
                <SelectPrimitive.SelectScrollDownButton className="flex h-[25px] items-center justify-center bg-slate-900 text-white">
                  <ChevronDownIcon />
                </SelectPrimitive.SelectScrollDownButton>
              </SelectPrimitive.SelectContent>
            </SelectPrimitive.SelectPortal>
          </SelectPrimitive.Select>

          <LabelHandle
            id="result-handle"
            position={Position.Right}
            label="Value"
          />
        </div>
      </Body>
    </div>
  );
});
const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.SelectItem
      className={classnames(
        "text-md relative flex h-[25px] items-center justify-between rounded px-1 font-mono leading-none text-white select-none data-[disabled]:pointer-events-none data-[disabled]:text-slate-500 data-[highlighted]:bg-slate-800 data-[highlighted]:outline-none",
        className
      )}
      {...props}
      ref={ref}
    >
      <SelectPrimitive.SelectItemText>
        {children}
      </SelectPrimitive.SelectItemText>
      <SelectPrimitive.SelectItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </SelectPrimitive.SelectItemIndicator>
    </SelectPrimitive.SelectItem>
  );
});

export default KeyPress;
