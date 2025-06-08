import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";

export default function GoalsDialog({ open }: { open: boolean }) {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const goals = LEVELS[currentLevel]?.goals || [
    "No goals defined for this level yet.",
  ];

  return (
    <Dialog open={open} modal={false}>
      <DialogPortal>
        <DialogContent className="fixed top-4 left-4 z-[20000] w-72 rounded-lg border-2 border-blue-300 bg-slate-800/95 p-4 font-mono text-white shadow-lg">
          <VisuallyHidden asChild>
            <DialogDescription>
              These are your goals for the {currentLevel} level.
            </DialogDescription>
          </VisuallyHidden>
          <DialogTitle className="mb-2 text-lg font-bold">Goals</DialogTitle>
          <ul className="list-disc space-y-2 pl-5">
            {goals.map((goal) => (
              <li key={goal.slice(0, 20)} className="text-base">
                {goal}
              </li>
            ))}
          </ul>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
