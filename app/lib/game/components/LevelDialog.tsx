import { DialogClose } from "@radix-ui/react-dialog";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";
import CustomDialog from "./CustomDialog";

/**
 * LevelDialog component displays the dialog for the current level.
 * It shows the level name, dialog text with a typing effect, and navigation buttons.
 * The dialog can be opened or closed, and it supports a trigger element.
 *
 * @param {Object} props - The component props.
 * @param {boolean} [props.open] - Whether the dialog is open.
 * @param {function} [props.onOpenChange] - Callback function to handle open state changes.
 * @param {React.ReactNode} [props.trigger] - Element to trigger the dialog.
 */
const LevelDialog = ({
  open,
  onOpenChange,
  trigger,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}) => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const levelName = LEVELS[currentLevel].name;
  const dialogs = LEVELS[currentLevel].dialog;

  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const dialog = dialogs[currentDialogIndex];
  const [typedText, setTypedText] = useState("");

  // Typing effect
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index <= dialog.length) {
        setTypedText(dialog.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => {
      clearInterval(interval);
      setTypedText("");
    };
  }, [dialog]);

  const startButtonRef = useRef<HTMLButtonElement>(null);

  /* Function to handle the "Next" button click */
  const handleNext = () => {
    if (currentDialogIndex < dialogs.length - 1) {
      const nextIndex = currentDialogIndex + 1;
      setCurrentDialogIndex(nextIndex);
    }
  };

  /* Function to handle the "Previous" button click */
  const handlePrevious = () => {
    if (currentDialogIndex > 0) {
      const previousIndex = currentDialogIndex - 1;
      setCurrentDialogIndex(previousIndex);
    }
  };

  return (
    <CustomDialog
      title={levelName}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      desc={`This dialog displays the level goals and instructions for the
            ${levelName} level. You can close it by clicking the close button or
            pressing the escape key.`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-1 flex-row">
          {/* Left side: Raccoon sprite */}
          <div className="my-auto w-1/3">
            <div
              style={{
                aspectRatio: "7 / 6",
                width: "100%",
                backgroundImage: "url('/game/sprites/raccoon_spritesheet.png')",
                backgroundPosition: "0 0",
                backgroundSize: "400% 400%",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
              }}
            ></div>
          </div>

          {/* Right side: Description text */}
          <div className="relative my-auto h-36 w-full rounded-lg bg-slate-700 p-4 text-white shadow-lg">
            <div className="absolute top-1/2 -left-2.5 h-0 w-0 -translate-y-1/2 border-t-10 border-r-10 border-b-10 border-t-transparent border-r-slate-700 border-b-transparent"></div>
            <p className="h-full overflow-auto pr-2 text-lg italic [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-900">
              {typedText}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <button
            onClick={handlePrevious}
            disabled={currentDialogIndex === 0}
            className={classNames(
              "rounded-lg bg-slate-700/80 px-3 py-2 focus:outline-1 focus:outline-blue-300",
              currentDialogIndex === 0
                ? "opacity-50"
                : "cursor-pointer hover:bg-slate-600"
            )}
          >
            Previous
          </button>
          {currentDialogIndex === dialogs.length - 1 ? (
            <DialogClose asChild>
              <button
                ref={startButtonRef}
                onClick={() => {
                  setCurrentDialogIndex(0);
                }}
                className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
              >
                Start
              </button>
            </DialogClose>
          ) : (
            <button
              onClick={handleNext}
              className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </CustomDialog>
  );
};

export default LevelDialog;
