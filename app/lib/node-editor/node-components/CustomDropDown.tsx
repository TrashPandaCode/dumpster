import { ChevronDownIcon } from "@radix-ui/react-icons";
import React, { useState, type ReactNode } from "react";

const CustomDropDown = ({
  children,
  category = "",
  ...props
}: {
  children: ReactNode;
  category?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-fit transition-all duration-200 ease-in-out" {...props}>
      <button
        onClick={() => setOpen(!open)}
        className="text-s flex w-full justify-between rounded-sm px-2 py-1 text-left font-mono font-bold text-white hover:bg-slate-800 focus:bg-slate-800 focus:outline-none"
      >
        {category}
        {<ChevronDownIcon />}
      </button>
      {
        <div
          className={
            "flex flex-col items-start justify-start rounded-sm bg-slate-900 text-white transition-all duration-200 ease-in-out" +
            (open
              ? " h-fit border-1 border-slate-700 p-2"
              : " h-0 overflow-hidden p-0")
          }
        >
          <div className="flex w-full flex-col">{children}</div>
        </div>
      }
    </div>
  );
};

export default CustomDropDown;
