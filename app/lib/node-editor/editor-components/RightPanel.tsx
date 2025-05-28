import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ClipboardIcon,
  CopyIcon,
  CubeIcon,
  HamburgerMenuIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { Panel, useReactFlow, type ReactFlowInstance } from "@xyflow/react";
import classnames from "classnames";
import { useState } from "react";
import { NavLink } from "react-router";

import { LEVELS } from "~/lib/game/core/levels";
import { useGameStore } from "~/lib/zustand/game";
import { useNodeStore } from "../node-store/node-store";
import AddNodes from "./AddNodes";
import { IconButton } from "./IconButton";

const RightPanel: React.FC<{ rfInstance: ReactFlowInstance | undefined }> = ({
  rfInstance,
}) => {
  const { getNodes, getEdges, setViewport, setEdges, setNodes } =
    useReactFlow();

  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const level = useGameStore((state) => state.currentLevel);
  const hints = LEVELS[level].hints.length
    ? LEVELS[level].hints
    : ["No hints here"];
  const [hintIndex, setHintIndex] = useState(0);

  return (
    <Panel
      position="top-right"
      className="flex flex-col items-end justify-center gap-2"
    >
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <IconButton side="left" tooltip="Add Node" aria-label="Add Node">
            <HamburgerMenuIcon className="text-white" />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <AddNodes
              onClose={() => setIsDropdownOpen(false)}
              x={1800}
              y={400}
            />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton side="left" tooltip="Help Menu" aria-label="Help Menu">
            <QuestionMarkIcon className="text-white" />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <div className="flex w-200 flex-col gap-4 rounded bg-slate-800 p-4 font-mono text-white shadow-lg outline-1 outline-slate-700 outline-solid">
              <h1 className="text-xl">Hints</h1>
              {hints[hintIndex]}
              <NavLink
                className="text-slate-400 italic hover:underline"
                target="_blank"
                to="/docs/"
              >
                Find information on this topic here
              </NavLink>
              <hr className="mx-auto h-1 w-full rounded-sm border-0 bg-slate-700" />
              <div className="flex flex-row justify-center gap-2">
                <button
                  disabled={hintIndex === 0}
                  className={classnames(
                    "rounded bg-slate-700 px-2 py-1 text-left text-sm text-white",
                    hintIndex === 0
                      ? "opacity-50"
                      : "cursor-pointer hover:bg-slate-600"
                  )}
                  onClick={() => {
                    if (hintIndex > 0) {
                      setHintIndex(hintIndex - 1);
                    }
                  }}
                >
                  Previous Hint
                </button>
                <button
                  disabled={hintIndex === hints.length - 1}
                  className={classnames(
                    "rounded bg-slate-700 px-2 py-1 text-left text-sm text-white",
                    hintIndex === hints.length - 1
                      ? "opacity-50"
                      : "cursor-pointer hover:bg-slate-600"
                  )}
                  onClick={() => {
                    if (hintIndex < hints.length - 1) {
                      setHintIndex(hintIndex + 1);
                    }
                  }}
                >
                  Next Hint
                </button>
                <button className="cursor-pointer rounded bg-slate-700 px-2 py-1 text-left text-sm text-white hover:bg-slate-600">
                  First Correct Node
                </button>
                <button className="hover:bg-jam-600 cursor-pointer rounded bg-slate-700 px-2 py-1 text-left text-sm text-white">
                  Full Solution
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      {process.env.NODE_ENV === "development" && (
        <>
          <IconButton
            onClick={nodeStateDebugPrint}
            side="left"
            tooltip="Print Node State"
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Nodes"
            side="left"
            onClick={() => {
              console.log(getNodes());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Edges"
            side="left"
            onClick={() => {
              console.log(getEdges());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Copy State"
            side="left"
            onClick={() => {
              const flow = rfInstance?.toObject();
              navigator.clipboard.writeText(JSON.stringify(flow));
            }}
          >
            <CopyIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Paste State"
            side="left"
            onClick={async () => {
              const flow = JSON.parse(await navigator.clipboard.readText());

              if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes);
                setEdges(flow.edges);
                setViewport({ x, y, zoom });
              }
            }}
          >
            <ClipboardIcon className="text-white" />
          </IconButton>
        </>
      )}
    </Panel>
  );
};

export default RightPanel;
