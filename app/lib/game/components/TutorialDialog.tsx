import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

type StepHighlight = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Step = {
  title: string;
  text: string;
  styling: string;
  highlight?: StepHighlight;
};

export default function TutorialDialog({
  open,
  onOpenChange,
  desc = "This tutorial dialog guides you through the main features of the game.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  desc?: string;
}) {
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(
    localStorage.getItem("hideTutorial") === "true"
  );

  const steps: Step[] = [
    // Step 0: Tutorial Start
    {
      styling:
        "fixed top-1/2 left-1/2 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "Welcome to our game!",
      text: "This is a short tutorial to help you get started.",
    },
    // Step 1: Kaplay Game
    {
      styling:
        "fixed top-1/2 left-1/4 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "The Game Window!",
      text: "This is the game window which shows your character and the game world. Here you'll be able to test all the features you implemented in the node editor.",
      highlight: {
        top: 0,
        left: 0,
        width: window.innerWidth / 2,
        height: window.innerHeight,
      },
    },
    // Step 2: Node Editor
    {
      styling:
        "fixed top-1/2 left-3/4 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "The Node Editor!",
      text: "This is the node editor where you can create and edit your game logic. Everything you create here will be executed in the game window.",
      highlight: {
        top: 0,
        left: window.innerWidth / 2,
        width: window.innerWidth / 2,
        height: window.innerHeight,
      },
    },
    // Step 3: Add Node
    {
      styling:
        "fixed top-1/2 left-1/2 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "Add Nodes!",
      text: "You can add nodes to the editor by right-clicking on the canvas. Each node represents a specific action or condition in your game logic.",
      highlight: {
        top: window.innerHeight * 0.15,
        left: window.innerWidth * 0.6,
        width: window.innerWidth * 0.3,
        height: window.innerHeight * 0.7,
      },
    },
    // Step 4: Export Flow
    {
      styling:
        "fixed top-1/2 left-1/2 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "Export Flow!",
      text: "Once you have created your game logic, you can export it to the game window by connecting your node tree(s) to the export node(s). This will allow you to test your logic in the game.",
      highlight: {
        top: window.innerHeight * 0.15,
        left: window.innerWidth * 0.6,
        width: window.innerWidth * 0.3,
        height: window.innerHeight * 0.7,
      },
    },
    // Step 5: Hints
    {
      styling: "fixed top-8 right-[6vw] min-w-[320px] z-[10000]",
      title: "Hints!",
      text: "Here you can find hints and get a full solution to the current level if you are stuck. Remember, there is also a question mark icon in the right corner of each node that provides additional information about the node's functionality.",
      highlight: {
        top: 50,
        left: window.innerWidth - 50,
        width: 40,
        height: 40,
      },
    },
    // Step 6: Reset
    {
      styling:
        "fixed top-[50px] left-3/4 min-w-[320px] z-[10000] -translate-x-1/2",
      title: "Reset!",
      text: "Be careful with this button! It will reset the whole level and all your nodes will be deleted.",
      highlight: {
        top: 48,
        left: window.innerWidth * 0.5 + 12,
        width: 45,
        height: 43,
      },
    },
    // Step 7: Navigation
    {
      styling:
        "fixed top-[150px] left-3/4 min-w-[320px] z-[10000] -translate-x-1/2",
      title: "Navigation!",
      text: "Use these buttons to navigate in between the different levels of the game. You can also use the home button to return to the main menu.",
      highlight: {
        top: 10,
        left: window.innerWidth * 0.723,
        width: 123,
        height: 42,
      },
    },
  ];

  const isLastStep = step === steps.length - 1;

  function handleFinish() {
    if (dontShowAgain) localStorage.setItem("hideTutorial", "true");
    onOpenChange(false);
  }

  const highlight = steps[step].highlight;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {highlight ? (
          <>
            <div className="pointer-events-auto fixed inset-0 z-[9998]">
              <svg className="h-full w-full">
                <defs>
                  <mask id="hole-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={highlight.left}
                      y={highlight.top}
                      width={highlight.width}
                      height={highlight.height}
                      rx="8"
                      ry="8"
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.4)"
                  mask="url(#hole-mask)"
                />
              </svg>
            </div>

            <div
              className="pointer-events-none fixed z-[9999] rounded-lg border-2 border-blue-400"
              style={{
                top: highlight.top,
                left: highlight.left,
                width: highlight.width,
                height: highlight.height,
              }}
            />
          </>
        ) : (
          <DialogOverlay className="fixed inset-0 z-[9999] bg-black/40" />
        )}

        <DialogContent
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
          className={`${steps[step].styling} z-[10001] max-w-2xl rounded-lg border-2 border-blue-300 bg-slate-800/85 p-8 font-mono text-white shadow-lg`}
        >
          <DialogTitle className="mb-2 text-2xl font-bold">
            {steps[step].title}
          </DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>{desc}</DialogDescription>
          </VisuallyHidden>
          <div className="mb-4">{steps[step].text}</div>
          {isLastStep && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                id="dontShowAgain"
              />
              <label htmlFor="dontShowAgain" className="select-none">
                Don't show again
              </label>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              {step + 1} / {steps.length}
            </div>
            <div className="flex justify-end gap-5">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className={
                  "rounded-lg bg-slate-700/80 px-3 py-2 focus:outline-1 focus:outline-blue-300" +
                  (step === 0
                    ? " opacity-50"
                    : " cursor-pointer hover:bg-slate-600")
                }
              >
                Back
              </button>
              {isLastStep ? (
                <button
                  onClick={handleFinish}
                  className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={() => setStep(step + 1)}
                  className="cursor-pointer rounded-lg bg-slate-700/80 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
                  autoFocus={step === 0}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
