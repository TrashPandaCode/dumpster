import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

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

  const steps = [
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
    },
    // Step 2: Node Editor
    {
      styling:
        "fixed top-1/2 left-3/4 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "The Node Editor!",
      text: "This is the node editor where you can create and edit your game logic. Everything you create here will be executed in the game window.",
    },
    // Step 3: Add Node
    {
      styling:
        "fixed top-1/2 left-1/2 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "Add Nodes!",
      text: "You can add nodes to the editor by right-clicking on the canvas. Each node represents a specific action or condition in your game logic.",
    },
    // Step 4: Export Flow
    {
      styling:
        "fixed top-1/2 left-1/2 min-w-[320px] z-[10000] -translate-x-1/2 -translate-y-1/2",
      title: "Export Flow!",
      text: "Once you have created your game logic, you can export it to the game window by connecting your node tree(s) to the export node(s). This will allow you to test your logic in the game.",
    },
    // Step 5: Hints
    {
      styling: "fixed top-8 right-[6vw] min-w-[320px] z-[10000]",
      title: "Hints!",
      text: "Here you can find hints and get a full solution to the current level if you are stuck. Remember, there is also a question mark icon in the right corner of each node that provides additional information about the node's functionality.",
    },
    // Step 6: Reset
    {
      styling:
        "fixed top-[50px] left-3/4 min-w-[320px] z-[10000] -translate-x-1/2",
      title: "Reset!",
      text: "Be careful with this button! It will reset the whole level and all your nodes will be deleted.",
    },
    // Step 7: Navigation
    {
      styling:
        "fixed top-[150px] left-3/4 min-w-[320px] z-[10000] -translate-x-1/2",
      title: "Navigation!",
      text: "Use these buttons to navigate in between the different levels of the game. You can also use the home button to return to the main menu.",
    },
  ];

  const isLastStep = step === steps.length - 1;

  function handleFinish() {
    if (dontShowAgain) localStorage.setItem("hideTutorial", "true");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {step === 1 ? (
          // Tutorial Start
          <div className="pointer-events-none fixed inset-0 z-[10000] flex">
            <div className="relative h-full w-1/2">
              <div className="absolute inset-0 box-content border-4 border-blue-400"></div>
            </div>
            <div className="h-full w-1/2 bg-black/40"></div>
          </div>
        ) : step === 2 ? (
          // Kaplay Game
          <div className="pointer-events-none fixed inset-0 z-[10000] flex">
            <div className="h-full w-1/2 bg-black/40"></div>
            <div className="relative h-full w-1/2">
              <div className="absolute inset-0 box-content border-4 border-blue-400"></div>
            </div>
          </div>
        ) : step === 3 || step === 4 ? (
          // Node Editor and Export Flow
          <div className="pointer-events-none fixed inset-0 z-[10000]">
            <div className="absolute top-0 left-0 h-full w-[60%] bg-black/40"></div>
            <div className="absolute top-0 right-0 h-full w-[10%] bg-black/40"></div>
            <div className="absolute top-0 left-[60%] h-[15%] w-[30%] bg-black/40"></div>
            <div className="absolute bottom-0 left-[60%] h-[15%] w-[30%] bg-black/40"></div>
            <div className="pointer-events-none absolute top-[15%] left-[60%] box-content h-[70%] w-[30%] border-4 border-blue-400"></div>
          </div>
        ) : step === 5 ? (
          // Hints
          <div className="pointer-events-none fixed inset-0 z-[10000]">
            <div className="absolute top-0 right-[4vw] left-0 h-[320px] bg-black/40"></div>
            <div className="absolute top-[320px] right-0 bottom-0 left-0 bg-black/40"></div>
            <div className="pointer-events-none absolute top-0 right-0 box-content h-[320px] w-[4vw] border-4 border-blue-400"></div>
          </div>
        ) : step === 6 ? (
          // Reset
          <div className="pointer-events-none fixed inset-0 z-[10000]">
            <div className="absolute top-0 right-[52vw] left-0 h-[160px] bg-black/40"></div>
            <div className="absolute top-0 right-0 left-[55vw] h-[160px] bg-black/40"></div>
            <div className="absolute top-[160px] right-0 bottom-0 left-0 bg-black/40"></div>
            <div className="pointer-events-none absolute top-0 left-[48vw] box-content h-[160px] w-[7vw] border-4 border-blue-400 bg-transparent"></div>
          </div>
        ) : step === 7 ? (
          // Navigation
          <div className="pointer-events-none fixed inset-0 z-[10000]">
            <div className="absolute top-0 right-[30vw] left-0 h-[100px] bg-black/40"></div>
            <div className="absolute top-0 right-0 left-[82vw] h-[100px] bg-black/40"></div>
            <div className="absolute top-[100px] right-0 bottom-0 left-0 bg-black/40"></div>
            <div className="pointer-events-none absolute top-0 left-[70vw] box-content h-[100px] w-[12vw] border-4 border-blue-400 bg-transparent"></div>
          </div>
        ) : (
          <DialogOverlay className="fixed inset-0 bg-black/40" />
        )}
        <DialogContent
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
          className={`${steps[step].styling} z-[10001] max-w-2xl rounded-lg border-2 border-blue-300 bg-slate-800/65 p-8 font-mono text-white shadow-lg`}
        >
          <DialogTitle className="mb-2 text-2xl font-bold">
            {steps[step].title}
          </DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>{desc}</DialogDescription>
          </VisuallyHidden>
          <div className="mb-4">{steps[step].text}</div>
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
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
