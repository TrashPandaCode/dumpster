/*
 * Authors: Markus Heming
 *
 * Purpose: This component displays a dialog when a level is completed.
 */
import { DialogClose } from "@radix-ui/react-dialog";
import { NavLink } from "react-router";

import raccoonImage from "~/assets/raccoon.png";
import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";
import { getNeighborLevels } from "../utils/navigator";
import CustomDialog from "./CustomDialog";

/**
 * LevelCompleteDialog component displays the dialog for level completion.
 * It shows the level name, success message, and buttons to navigate to the main menu or next level.
 */
const LevelCompleteDialog = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const levelName = LEVELS[currentLevel].name;
  const nextLevel = getNeighborLevels(currentLevel)?.next;
  const pause = useGameStore((state) => state.pause);

  const levelCompleteDialogOpen = useGameStore(
    (state) => state.levelCompleteDialogOpen
  );
  const setLevelCompleteDialogOpen = useGameStore(
    (state) => state.setLevelCompleteDialogOpen
  );

  return (
    <CustomDialog
      title={levelName}
      open={levelCompleteDialogOpen}
      onOpenChange={setLevelCompleteDialogOpen}
      desc={`This dialog displays the level completion dialog of the
            ${levelName} level. You can now get to the main menu 
            using the To Menu button or to the next level using the 
            Next Level button.`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-1 flex-row items-center">
          <img
            src={raccoonImage}
            className="pixelate mr-8 aspect-square h-full w-1/3"
          />

          <div className="relative my-auto flex h-36 w-full flex-col items-center justify-center rounded-lg bg-slate-700 p-4 text-white shadow-lg">
            <div className="absolute top-1/2 -left-2.5 h-0 w-0 -translate-y-1/2 border-t-10 border-r-10 border-b-10 border-t-transparent border-r-slate-700 border-b-transparent"></div>
            <p className="mb-2 text-2xl font-bold">
              {LEVELS[currentLevel].success}
            </p>
            <p className="text-lg italic">Congratulations!</p>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <DialogClose asChild>
            <NavLink
              to={"/"}
              className="cursor-pointer rounded-lg bg-slate-700/80 px-4 py-2 text-white hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
            >
              To Menu
            </NavLink>
          </DialogClose>
          <DialogClose asChild>
            <button className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300">
              Continue Playing
            </button>
          </DialogClose>
          {nextLevel && (
            <DialogClose asChild>
              <NavLink
                to={`/levels/${nextLevel}`}
                className="cursor-pointer rounded-lg bg-slate-700/80 px-4 py-2 text-white hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
                onClick={() => pause()}
              >
                Next Level
              </NavLink>
            </DialogClose>
          )}
        </div>
      </div>
    </CustomDialog>
  );
};

export default LevelCompleteDialog;
