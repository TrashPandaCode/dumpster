/*
 * Authors: Leo Kling
 *
 * Purpose: A wrapper around Radix UI's Tooltip component to provide a consistent
 *         styling and behavior across the application.
 */
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import classNames from "classnames";
import * as React from "react";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={classNames(
        "z-50 overflow-hidden rounded-md bg-slate-800 px-3 py-1.5 font-mono text-xs text-white shadow-md shadow-slate-950/50",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
