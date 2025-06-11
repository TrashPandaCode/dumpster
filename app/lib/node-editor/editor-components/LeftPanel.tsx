import {
  ChatBubbleIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Panel } from "@xyflow/react";

import LevelDialog from "~/lib/game/components/LevelDialog";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { useFlowStore } from "../node-store/flow-store";
import { useLoopStore } from "../node-store/loop-store";
import { useNodeStore } from "../node-store/node-store";
import { IconButton } from "./IconButton";

const LeftPanel = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const isPaused = useGameStore((state) => state.isPaused);
  const play = useGameStore((state) => state.play);
  const pause = useGameStore((state) => state.pause);

  const { undo, redo, clear } = useFlowStore.temporal.getState();

  return (
    <Panel
      position="top-left"
      className="flex flex-col items-center justify-center gap-2"
    >
      <IconButton
        tooltip="Play/Pause"
        side="right"
        onClick={() => {
          if (isPaused) {
            play();
          } else {
            pause();
          }
        }}
      >
        {isPaused ? (
          <PlayIcon className="text-white" />
        ) : (
          <PauseIcon className="text-white" />
        )}
      </IconButton>

      <Popover>
        <PopoverTrigger asChild>
          <IconButton tooltip="Reset Level" side="right" id="reset-level">
            <TrashIcon className="text-white" />
          </IconButton>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent side="right" sideOffset={10} className="mr-3">
            <div className="flex w-42 flex-col rounded bg-slate-800 p-2 font-mono text-white shadow-lg outline-1 outline-slate-700 outline-solid">
              <PopoverClose asChild>
                <button
                  className="hover:bg-jam-600 cursor-pointer rounded bg-slate-700 px-2 py-1 text-left text-sm text-white"
                  onClick={() => {
                    useFlowStore.getState().reset(currentLevel);
                    useNodeStore.getState().reset();
                    useLoopStore.getState().reset();
                    useDataStore.getState().reset(currentLevel);
                    useGameStore.getState().setLevelCompleted(false);
                    useGameStore.getState().init(currentLevel);
                  }}
                >
                  Reset Level?
                </button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <LevelDialog
        trigger={
          <IconButton tooltip="Level Info" side="right">
            <ChatBubbleIcon className="text-white" />
          </IconButton>
        }
      />

      <IconButton
        tooltip="Print Edges"
        side="left"
        onClick={() => {
          undo();
        }}
      >
        <ResetIcon className="text-white" />
      </IconButton>
      <IconButton
        tooltip="Print Edges"
        side="left"
        onClick={() => {
          redo();
        }}
      >
        <ResetIcon className="-scale-x-100 text-white" />
      </IconButton>
    </Panel>
  );
};

export default LeftPanel;
