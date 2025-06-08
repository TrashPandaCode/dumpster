import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible as Root,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router";

const Collapsible = ({
  title,
  children,
  open
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) => {
  const location = useLocation();

  const isTitleActive = (title: string): boolean =>
    location.pathname.split("/")[2] ===
    title.toLowerCase().replace(/\s+/g, "-");
  const isActive = isTitleActive(title);

  const [internalOpen, setInternalOpen] = useState(open ?? isActive);

  useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  return (
    <Root open={internalOpen} onOpenChange={setInternalOpen}>

      <CollapsibleTrigger
        className={classnames(
          "group flex w-full items-baseline justify-between rounded p-2 text-left text-sm",
          internalOpen ? "bg-slate-100" : ""
        )}
      >
        <span>{title}</span>
        <span
          className={classnames(
            "ml-2 transition-opacity",
            internalOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {internalOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col space-y-1 pl-8 nth-[2]:pt-1">
        {children}
      </CollapsibleContent>
    </Root>
  );
};

export default Collapsible;
