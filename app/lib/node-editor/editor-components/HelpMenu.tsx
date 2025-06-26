import { QuestionMarkIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import classnames from "classnames";
import { useState } from "react";
import { NavLink } from "react-router";

import { LEVELS } from "~/lib/game/core/levels";
import type { GameObject } from "~/lib/game/game-objects";
import { useDataStore, type HandleData } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { IconButton } from "./IconButton";

const solutions = import.meta.glob("/content/solutions/*.json");

const HelpMenu = () => {
  const { setNodes, setEdges, setViewport } = useReactFlow();

  const level = useGameStore((state) => state.currentLevel);
  const hints = LEVELS[level].hints.length
    ? LEVELS[level].hints
    : ["No hints here"];
  const [hintIndex, setHintIndex] = useState(0);

  const solutionLoader = solutions[`/content/solutions/${level}.json`];

  const handleFullSolution = async () => {
    const flow = (await solutionLoader()) as {
      nodes: Node[];
      edges: Edge[];
      viewport?: { x: number; y: number; zoom: number };
      data?: {
        initData: boolean;
        gameObjects: [GameObject, [string, HandleData][]][];
      };
    };

    if (flow) {
      if (flow.data) {
        localStorage.setItem(`data-store-${level}`, JSON.stringify(flow.data));
        useDataStore.getState().init(level);
      }

      const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setViewport({ x, y, zoom });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          id="help-menu"
          side="left"
          tooltip="Help Menu"
          aria-label="Help Menu"
        >
          <QuestionMarkIcon className="text-white" />
        </IconButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="bottom" className="mr-3">
          <div className="flex w-200 flex-col gap-4 rounded bg-slate-800 p-4 font-mono text-white shadow-lg outline-1 outline-slate-700 outline-solid">
            <div className="flex flex-row justify-between">
              <h1 className="text-xl">Hints</h1>
              <button
                className="cursor-pointer rounded bg-slate-700 px-2 py-1 text-left text-sm text-white hover:bg-slate-600"
                onClick={() => {
                  localStorage.setItem("hideTutorial", "false");
                }}
              >
                Reset Tutorials
              </button>
            </div>
            {hints[hintIndex]}
            <NavLink
              className="text-slate-400 italic hover:underline"
              target="_blank"
              to={`/docs/level-guides/${LEVELS[level].slug}`}
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
              {hintIndex === hints.length - 1 && (
                <button
                  className="hover:bg-jam-600 cursor-pointer rounded bg-slate-700 px-2 py-1 text-left text-sm text-white"
                  onClick={handleFullSolution}
                >
                  Full Solution
                </button>
              )}
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

export default HelpMenu;
