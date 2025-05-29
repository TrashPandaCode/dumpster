import { DialogClose } from "@radix-ui/react-dialog";
import { NavLink } from "react-router";

import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";
import CustomDialog from "./CustomDialog";

function getNextLevel(curLevel: string) {
  const keys = Object.keys(LEVELS);
  const currentIndex = keys.indexOf(curLevel);

  if (currentIndex === -1 || currentIndex === keys.length - 1) {
    return undefined;
  }

  return keys[currentIndex + 1];
}

const LevelCompleteDialog = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const nextLevel = getNextLevel(currentLevel);

  const levelCompleteDialogOpen = useGameStore(
    (state) => state.levelCompleteDialogOpen
  );
  const setLevelCompleteDialogOpen = useGameStore(
    (state) => state.setLevelCompleteDialogOpen
  );

  return (
    <CustomDialog
      title={currentLevel}
      open={levelCompleteDialogOpen}
      onOpenChange={setLevelCompleteDialogOpen}
      desc={`This dialog displays the level completion dialog of the
            ${currentLevel} level. You can now get to the main menu 
            using the To Menu button or to the next level using the 
            Next Level button.`}
      showClose={false}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-1 flex-row">
          {/* Left side: Raccoon sprite */}
          <div className="my-auto w-1/3 pr-4">
            <div
              style={{
                aspectRatio: "1 / 1",
                width: "100%",
                backgroundImage: "url('/game/sprites/raccoon_spritesheet.png')",
                backgroundPosition: "0 0",
                backgroundSize: "400% 400%",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
              }}
            ></div>
          </div>
          {/* Right side: Success text */}
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
          {nextLevel && (
            <DialogClose asChild>
              <NavLink
                to={`/game/${nextLevel}`}
                className="cursor-pointer rounded-lg bg-slate-700/80 px-4 py-2 text-white hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
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
