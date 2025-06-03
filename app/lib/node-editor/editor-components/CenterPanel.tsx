import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from "@radix-ui/react-icons";
import { Panel } from "@xyflow/react";
import { NavLink } from "react-router";

import { getNeighborLevels } from "~/lib/game/utils/navigator";
import { useGameStore } from "~/lib/zustand/game";
import { IconButton } from "./IconButton";

const CenterPanel = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const neighborLevels = getNeighborLevels(currentLevel);

  return (
    <Panel
      position="top-center"
      className="flex flex-row items-center justify-center gap-2"
    >
      {neighborLevels?.prev && (
        <NavLink to={`/levels/${neighborLevels?.prev}`}>
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
        <NavLink to={`/levels/${neighborLevels?.next}`}>
          <IconButton tooltip="Next Level" side="right">
            <ArrowRightIcon className="text-white" />
          </IconButton>
        </NavLink>
      )}
    </Panel>
  );
};

export default CenterPanel;
