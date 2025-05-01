import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import classnames from "classnames";
import React from "react";

import CustomDropDown from "./CustomDropDown";

type Items = {
  [key: string]: string[];
};

const SelectDropDown = ({
  setSelected,
  items,
}: {
  setSelected(key: string): void;
  items: Items;
}) => {
  return (
    <SelectPrimitive.Select onValueChange={(key) => setSelected(key)}>
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
              {Object.entries(items).map(([category, items]) => (
                <CustomDropDown key={category} category={category}>
                  {items.map((item) => (
                    <SelectItem value={item} key={item} className="w-full">
                      {item}
                    </SelectItem>
                  ))}
                </CustomDropDown>
              ))}
            </SelectPrimitive.SelectGroup>
          </SelectPrimitive.SelectViewport>
          <SelectPrimitive.SelectScrollDownButton className="flex h-[25px] items-center justify-center bg-slate-900 text-white">
            <ChevronDownIcon />
          </SelectPrimitive.SelectScrollDownButton>
        </SelectPrimitive.SelectContent>
      </SelectPrimitive.SelectPortal>
    </SelectPrimitive.Select>
  );
};

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

export default SelectDropDown;
