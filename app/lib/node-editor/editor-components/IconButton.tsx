import classnames from "classnames";
import React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    tooltip?: string | React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
  }
>(({ tooltip, className, children, side, ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          className={classnames(
            "cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </TooltipTrigger>

      <TooltipContent side={side}>
        {typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip}
      </TooltipContent>
    </Tooltip>
  );
});
