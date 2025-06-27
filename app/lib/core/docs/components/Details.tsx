import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useState, type ReactNode } from "react";

/**
 * Details component that renders a collapsible section with a summary and content.
 * It uses Radix UI's Collapsible component for the collapsible functionality.
 * The summary can be a string or a ReactNode, and the content is rendered inside the
 * collapsible section. The component also supports a default open state.
 */
const Details = ({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pb-2">
      <CollapsibleTrigger
        className={classnames(
          "group flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100",
          "transition-all duration-200"
        )}
      >
        <span className="font-medium text-slate-900">{summary}</span>
        <span className="ml-2 text-slate-500 transition-transform duration-200">
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        <div className="rounded-b-lg border-x border-b border-slate-200 bg-white p-4 text-slate-700">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Details;
