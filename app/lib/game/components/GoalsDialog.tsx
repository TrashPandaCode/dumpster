import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRef, useState } from "react";

import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";

export default function GoalsDialog({ open }: { open: boolean }) {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const goals = LEVELS[currentLevel]?.goals || [
    "No goals defined for this level yet.",
  ];

  // Position state and drag handling
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    const width = 288;
    const height = 96;
    const minX = 0;
    const minY = 0;
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    const grid = 16;

    let x = e.clientX - dragOffset.current.x;
    let y = e.clientY - dragOffset.current.y;

    // Snap to grid if shift key is held
    if (e.shiftKey) {
      x = Math.round(x / grid) * grid;
      y = Math.round(y / grid) * grid;
    }

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    setPos({ x, y });
  }

  function onMouseUp() {
    dragging.current = false;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  return (
    <Dialog open={open} modal={false}>
      <DialogPortal>
        <DialogContent
          style={{
            left: pos.x,
            top: pos.y,
            position: "fixed",
            margin: 0,
          }}
          className="z-[20000] w-72 rounded-lg border-2 border-blue-300 bg-slate-800/95 p-4 font-mono text-white shadow-lg select-none"
        >
          <VisuallyHidden asChild>
            <DialogDescription>
              These are your goals for the {currentLevel} level.
            </DialogDescription>
          </VisuallyHidden>
          <DialogTitle
            className="mb-2 cursor-move text-lg font-bold"
            onMouseDown={onMouseDown}
          >
            Goals
          </DialogTitle>
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
