import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import {
  Item,
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";
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
        <Select>
          <SelectTrigger
            className="text-violet11 hover:bg-mauve3 data-[placeholder]:text-violet9 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
            aria-label="Food"
          >
            <SelectValue placeholder="Select a fruit…" />
            <SelectIcon className="text-violet11">
              <ChevronDownIcon />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectContent className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
              <SelectScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
                <ChevronUpIcon />
              </SelectScrollUpButton>
              <SelectViewport className="p-[5px]">
                <SelectGroup>
                  <SelectLabel className="text-mauve11 px-[25px] text-xs leading-[25px]">
                    Fruits
                  </SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>

                <SelectSeparator className="bg-violet6 m-[5px] h-px" />

                <SelectGroup>
                  <SelectLabel className="text-mauve11 px-[25px] text-xs leading-[25px]">
                    Vegetables
                  </SelectLabel>
                  <SelectItem value="aubergine">Aubergine</SelectItem>
                  <SelectItem value="broccoli">Broccoli</SelectItem>
                  <SelectItem value="carrot" disabled>
                    Carrot
                  </SelectItem>
                  <SelectItem value="courgette">Courgette</SelectItem>
                  <SelectItem value="leek">Leek</SelectItem>
                </SelectGroup>

                <SelectSeparator className="bg-violet6 m-[5px] h-px" />

                <SelectGroup>
                  <SelectLabel className="text-mauve11 px-[25px] text-xs leading-[25px]">
                    Meat
                  </SelectLabel>
                  <SelectItem value="beef">Beef</SelectItem>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="lamb">Lamb</SelectItem>
                  <SelectItem value="pork">Pork</SelectItem>
                </SelectGroup>
              </SelectViewport>
              <SelectScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
                <ChevronDownIcon />
              </SelectScrollDownButton>
            </SelectContent>
          </SelectPortal>
        </Select>
        <div className="flex w-full justify-end gap-2">
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
  React.ComponentRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectItem
      className={classnames(
        "text-violet11 data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 relative flex h-[25px] items-center rounded-[3px] pr-[35px] pl-[25px] text-[13px] leading-none select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
        className
      )}
      {...props}
      ref={ref}
    >
      <SelectItemText>{children}</SelectItemText>
      <SelectItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </SelectItemIndicator>
    </SelectItem>
  );
});

export default KeyPress;
