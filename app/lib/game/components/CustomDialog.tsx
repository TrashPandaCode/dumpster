import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";

import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";

const CustomDialog = ({ skip = false }: { skip?: boolean }) => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const goals = LEVELS[currentLevel]?.goals || [
    "No goals defined for this level yet.",
  ];
  const descriptions = LEVELS[currentLevel]?.description || [
    "No description available for this level.",
  ];

  const index = useRef(0);

  const [typedText, setTypedText] = useState("");
  const [description, setDescription] = useState(descriptions[index.current]);

  const [showingGoals, setShowingGoals] = useState(skip);

  // Typing effect
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index <= description.length) {
        setTypedText(description.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => {
      clearInterval(interval);
      setTypedText("");
    };
  }, [description]);

  const handleNext = () => {
    if (!showingGoals) {
      if (index.current < descriptions.length - 1) {
        index.current++;
        setDescription(descriptions[index.current]);
      } else {
        index.current = 0;
        setShowingGoals(true);
        setDescription("");
      }
    }
  };

  const handlePrevious = () => {
    if (showingGoals) {
      setShowingGoals(false);
      index.current = descriptions.length - 1;
      setDescription(descriptions[index.current]);
    } else if (index.current > 0) {
      index.current--;
      setDescription(descriptions[index.current]);
    }
  };

  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 bg-slate-800/25" />
      <DialogContent className="fixed top-1/2 left-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg border-3 border-blue-300 bg-slate-800/95 p-8 font-mono text-white">
        <DialogTitle className="text-center text-4xl font-bold capitalize">
          {currentLevel}
        </DialogTitle>

        <div className="flex flex-col gap-5">
          <div className="flex flex-1 flex-row">
            {/* Left side: Raccoon sprite */}
            <div className="my-auto w-1/3 pr-4">
              <div
                style={{
                  aspectRatio: "1 / 1",
                  width: "100%",
                  backgroundImage:
                    "url('/game/sprites/raccoon_spritesheet.png')",
                  backgroundPosition: "0 0",
                  backgroundSize: "400% 400%",
                  backgroundRepeat: "no-repeat",
                  imageRendering: "pixelated",
                }}
              ></div>
            </div>

            {/* Right side: Description text */}
            <div className="relative my-auto h-fit w-fit rounded-lg bg-slate-700 p-4 text-white shadow-lg">
              <div className="absolute top-1/2 -left-2 h-0 w-0 -translate-y-1/2 border-t-10 border-r-10 border-b-10 border-t-transparent border-r-slate-700 border-b-transparent"></div>
              <p className="text-lg italic">
                {showingGoals ? (
                  <>
                    <span className="not-italic">Goals:</span>
                    {goals.map((goal) => (
                      <li key={goal.slice(0, 20)} className="text-lg italic">
                        {goal}
                      </li>
                    ))}
                  </>
                ) : (
                  typedText
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-5">
            <button
              onClick={handlePrevious}
              className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-none"
            >
              Previous
            </button>
            {showingGoals ? (
              <DialogClose asChild>
                <button className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-none">
                  Start
                </button>
              </DialogClose>
            ) : (
              <button
                onClick={handleNext}
                className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-none"
              >
                Next
              </button>
            )}
          </div>
        </div>

        <DialogClose asChild>
          <button
            className="absolute top-2.5 right-2.5 inline-flex size-[25px] cursor-pointer appearance-none items-center justify-center rounded-full bg-slate-700 focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  );
};

export default CustomDialog;
