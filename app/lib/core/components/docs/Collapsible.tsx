import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible as Root,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useState, type ReactNode } from "react";

const Collapsible = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Root open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={classnames(
          "group flex w-full items-baseline justify-between text-left rounded px-2 py-1",
          open ? "bg-slate-100" : ""
        )}
      >
        <span>{title}</span>
        <span
          className={classnames(
            "ml-2 transition-opacity",
            open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 pl-8 nth-[2]:pt-2">
        {children}
      </CollapsibleContent>
    </Root>
  );
};

export default Collapsible;
