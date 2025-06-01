import {
  InfoCircledIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
} from "@radix-ui/react-icons";
import { Panel } from "@xyflow/react";

import LevelDialog from "~/lib/game/components/LevelDialog";
import { LEVELS } from "~/lib/game/core/levels";
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
      <IconButton
        tooltip="Reset Level"
        side="right"
        onClick={() => {
          useFlowStore.getState().reset();
          useNodeStore.getState().reset();
          useLoopStore.getState().reset();
          useDataStore
            .getState()
            .init(LEVELS[currentLevel].modifiableGameObjects);
        }}
      >
        <ResetIcon className="text-white" />
      </IconButton>
      <LevelDialog
        skip={true}
        trigger={
          <IconButton tooltip="Level Info" side="right">
            <InfoCircledIcon className="text-white" />
          </IconButton>
        }
      />
    </Panel>
  );
};

export default LeftPanel;
