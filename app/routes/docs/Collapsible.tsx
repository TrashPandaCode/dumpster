import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible as Root,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState, type ReactNode } from "react";

const Collapsible = ({title, children}: {title: string, children: ReactNode}) => {
  const [open, setOpen] = useState(false);
  return (
    <Root open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-baseline">
        {title} {open ? <ChevronDownIcon className="ml-2" /> : <ChevronRightIcon className="ml-2" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8">
        {children}
      </CollapsibleContent>
    </Root>
  );
};

export default Collapsible;
