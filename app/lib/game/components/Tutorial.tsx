import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import Joyride, {
  type CallBackProps,
  type Step,
  type TooltipRenderProps,
} from "react-joyride";

import exportVideo from "~/assets/videos/nodesexport.mp4";
import rightclickVideo from "~/assets/videos/nodesrightclick.mp4";

/*
 * This component provides a tutorial for the game, guiding users through the main features.
 * It uses react-joyride to create a step-by-step walkthrough.
 * The tutorial can be closed and will not show again if the user opts out.
 */
export default function Tutorial({ onClose }: { onClose: () => void }) {
  const steps = [
    {
      title: "Welcome to our game!",
      content: "This is a short tutorial to help you get started.",
      target: "#reset-level",
      placement: "center",
      disableBeacon: true,
    },
    {
      title: "The Game Window!",
      content:
        "This is the game window which shows your character and the game world. Here you'll be able to test all the features you implemented in the node editor.",
      target: "#game-panel",
      disableBeacon: true,
    },
    {
      title: "The Node Editor!",
      content:
        "This is the node editor where you can create and edit your game logic. Everything you create here will be executed in the game window.",
      target: "#nodes-panel",
      disableBeacon: true,
    },
    {
      title: "Add Nodes!",
      content: (
        <>
          You can add nodes to the editor by right-clicking on the canvas. Each
          node represents a specific action or condition in your game logic.
          <video autoPlay loop className="mt-4 rounded-md">
            <source src={rightclickVideo} type="video/mp4" />
          </video>
        </>
      ),
      target: "#nodes-panel",
      disableBeacon: true,
    },
    {
      title: "Add more Nodes!",
      content:
        "You can also add nodes by clicking the plus icon in the top right corner of the node editor. This will open the same menu as right-clicking on the canvas.",
      target: "#add-nodes",
      disableBeacon: true,
    },
    // Step 4: Export Flow
    {
      title: "Export Flow!",
      content: (
        <>
          Once you have created your game logic, you can export it to the game
          window by connecting your node tree(s) to the export node(s). This
          will allow you to test your logic in the game.
          <video autoPlay loop className="mt-4 rounded-md">
            <source src={exportVideo} type="video/mp4" />
          </video>
        </>
      ),
      target: "#nodes-panel",
      placement: "center",
      disableBeacon: true,
    },
    // Step 5: Hints
    {
      title: "Hints!",
      content:
        "Here you can find hints and get a full solution to the current level if you are stuck. You can also find a direct link to a level-guide here, that provides more in-depth background informations about the level. Remember, there is also a question mark icon in the right corner of each node that provides additional information about the node's functionality.",
      target: "#help-menu",
      disableBeacon: true,
    },
    // Step 6: Reset
    {
      title: "Reset!",
      content:
        "Be careful with this button! It will reset the whole level and all your nodes will be deleted.",
      target: "#reset-level",
      disableBeacon: true,
    },
    // Step 7: Navigation
    {
      title: "Navigation!",
      content:
        "Use these buttons to navigate in between the different levels of the game. You can also use the home button to return to the main menu.",
      target: "#center-panel",
      disableBeacon: true,
    },
  ] satisfies Step[];

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.status === "finished" || data.status === "skipped") {
      onClose();
    }
  };

  useEffect(() => {
    return () => onClose();
  }, []);

  return (
    <Joyride
      steps={steps}
      tooltipComponent={CustomTooltip}
      continuous
      callback={handleJoyrideCallback}
      styles={{
        spotlight: {
          border: "2px solid var(--color-blue-200)",
        },
      }}
      floaterProps={{
        styles: {
          arrow: {
            color: "var(--color-blue-300)",
          },
        },
      }}
    />
  );
}

function CustomTooltip({
  backProps,
  closeProps,
  index,
  primaryProps,
  skipProps,
  isLastStep,
  step,
  tooltipProps,
  size,
}: TooltipRenderProps) {
  return (
    <div
      className={`z-[10001] max-w-2xl rounded-lg border-2 border-blue-300 bg-slate-800/90 p-8 font-mono text-white shadow-lg`}
      {...tooltipProps}
    >
      <h1 className="mb-2 text-2xl font-bold">{step.title}</h1>
      <div className="mb-4">{step.content}</div>
      {(index === 0 || isLastStep) && (
        <div className="mb-4 flex items-center gap-2">
          <Checkbox
            className="flex size-5 appearance-none items-center justify-center rounded bg-white"
            onCheckedChange={(checked) =>
              localStorage.setItem("hideTutorial", checked.toString())
            }
            id="dontShowAgain"
          >
            <CheckboxIndicator>
              <CheckIcon className="text-black" />
            </CheckboxIndicator>
          </Checkbox>
          <label htmlFor="dontShowAgain" className="select-none">
            Don't show again
          </label>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          {index + 1} / {size}
        </div>
        <div className="flex justify-end gap-5">
          {index === 0 && (
            <button
              className="cursor-pointer rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
              {...skipProps}
            >
              Skip
            </button>
          )}
          <button
            disabled={index === 0}
            className={
              "rounded-lg bg-slate-700 px-3 py-2 focus:outline-1 focus:outline-blue-300" +
              (index === 0
                ? " opacity-50"
                : " cursor-pointer hover:bg-slate-600")
            }
            {...backProps}
          >
            Back
          </button>
          {isLastStep ? (
            <button
              className="cursor-pointer rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
              {...closeProps}
            >
              Start
            </button>
          ) : (
            <button
              className="cursor-pointer rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600 focus:outline-1 focus:outline-blue-300"
              autoFocus={index === 0}
              {...primaryProps}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
