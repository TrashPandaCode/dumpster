import { DialogClose } from "@radix-ui/react-dialog";
import classNames from "classnames";
import { NavLink, useNavigate } from "react-router";

import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { cleanupKaplay } from "../core/kaplayCtx";
import { LEVELS } from "../core/levels";
import CustomDialog from "./CustomDialog";

const getNextLevelUrl = (currentLevel: string) => {
  const levelIds = Object.keys(LEVELS).filter((id) => id !== "playground");
  const idx = levelIds.indexOf(currentLevel);

  return idx < levelIds.length - 1 ? `/game/${levelIds[idx + 1]}` : undefined;
};

const LevelCompleteDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const currentLevel = useGameStore((state) => state.currentLevel);

  const navigate = useNavigate();
  const nextLevelUrl = getNextLevelUrl(currentLevel);

  return (
    <CustomDialog
      title={currentLevel}
      open={open}
      onOpenChange={onOpenChange}
      desc={`This dialog displays the level completion dialog of the
            ${currentLevel} level. You can close it by clicking the close button or
            pressing the escape key.`}
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
            <p className="mb-2 text-2xl font-bold">You solved the equation!</p>
            <p className="text-lg italic">Congratulations!</p>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <button
            className="cursor-pointer rounded-lg bg-slate-700/80 px-4 py-2 text-white hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
            onClick={() => {
              useGameStore.getState().reset();
              onOpenChange(false);
              cleanupKaplay();
              window.location.href = "/";
            }}
          >
            To Menu old
          </button>
          <DialogClose asChild>
            <NavLink
              to={"/"}
              className="cursor-pointer rounded-lg bg-slate-700/80 px-4 py-2 text-white hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
            >
              To Menu
            </NavLink>
          </DialogClose>
          <DialogClose asChild>
            <button
              className="cursor-pointer rounded-lg bg-slate-700/80 px-4 py-2 text-white hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
              onClick={() => onOpenChange(false)}
            >
              Continue
            </button>
          </DialogClose>
          <button
            className={classNames(
              "rounded-lg bg-slate-700/80 px-4 py-2 text-white focus:outline-1 focus:outline-blue-300",
              nextLevelUrl ? "cursor-pointer hover:bg-slate-600" : "opacity-50"
            )}
            onClick={() => {
              if (nextLevelUrl) {
                useGameStore.getState().reset();
                onOpenChange(false);
                cleanupKaplay();
                navigate(nextLevelUrl);
              }
            }}
            disabled={!nextLevelUrl}
          >
            Next Level
          </button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default LevelCompleteDialog;
