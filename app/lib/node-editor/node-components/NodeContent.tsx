/*
 * Authors: Jonathan Kron, Leo Kling, Milan Jezovsek
 *
 * Purpose:
 * This file offers a React component for the node body.
 */
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Position } from "@xyflow/react";
import classnames from "classnames";
import { type ReactNode } from "react";
import { NavLink } from "react-router";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../editor-components/Tooltip";
import { LOOP_CONNECTOR } from "../nodes/constants";
import ConnectorHandle from "./ConnectorHandle";

const NodeContent = ({
  label,
  type,
  docsName,
  active = false,
  children,
  className,
}: {
  label: string | ReactNode;
  type: string;
  docsName: string;
  active?: boolean;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classnames(
        "flex flex-col rounded-sm border-1 pb-3 font-mono text-white",
        active
          ? "border-emerald-400 outline-2 outline-emerald-400"
          : "border-blue-300",
        className
      )}
    >
      <div className="flex items-start justify-between gap-5 p-3">
        <div>
          {typeof label === "string" ? (
            <h2 className="font-bold">{label}</h2>
          ) : (
            label
          )}
          <p className="text-xs italic">{type}</p>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              target="_blank"
              to={`/docs/nodes/${docsName.toLowerCase()}`}
            >
              <QuestionMarkCircledIcon className="cursor-pointer text-slate-400" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent>Go to documentation</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex h-full w-full flex-col justify-center">
        <ConnectorHandle id={LOOP_CONNECTOR} position={Position.Top} />
        {children}
      </div>
    </div>
  );
};

export default NodeContent;
