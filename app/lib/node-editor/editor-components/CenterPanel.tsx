/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This code offers the React component for the center panel of the node editor.
 * It includes functionality for navigating home or to neighboring levels.
 */
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from "@radix-ui/react-icons";
import { Panel } from "@xyflow/react";
import { NavLink } from "react-router";

import { getNeighborLevels } from "~/lib/game/utils/navigator";
import { useGameStore } from "~/lib/zustand/game";
import { IconButton } from "./IconButton";

const CenterPanel = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const neighborLevels = getNeighborLevels(currentLevel);

  // when navigating between levels, we briefly pause the game to prevent a new update cycle in the middle of a render
  // this is necessary because the game state is updated in the same cycle as the level changes
  const pause = useGameStore((state) => state.pause);

  return (
    <Panel
      position="top-center"
      className="flex flex-row items-center justify-center gap-2"
      id="center-panel"
    >
      {neighborLevels?.prev && (
        <NavLink to={`/levels/${neighborLevels?.prev}`} onClick={() => pause()}>
          <IconButton
            tooltip="Previous Level"
            side="left"
            className="text-white"
          >
            <ArrowLeftIcon className="text-white" />
          </IconButton>
        </NavLink>
      )}
      <NavLink to={"/"}>
        <IconButton tooltip="Home" side="bottom">
          <HomeIcon className="text-white" />
        </IconButton>
      </NavLink>
      {neighborLevels?.next && (
        <NavLink to={`/levels/${neighborLevels?.next}`} onClick={() => pause()}>
          <IconButton tooltip="Next Level" side="right">
            <ArrowRightIcon className="text-white" />
          </IconButton>
        </NavLink>
      )}
    </Panel>
  );
};

export default CenterPanel;
