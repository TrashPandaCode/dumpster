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

  const [pos, setPos] = useState({ x: 16, y: 16 });
  const dragRef = useRef<{
    isDragging: boolean;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    offset: { x: 0, y: 0 },
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.offset = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return;

    let x = e.clientX - dragRef.current.offset.x;
    let y = e.clientY - dragRef.current.offset.y;

    if (e.shiftKey) {
      const grid = 16;
      x = Math.round(x / grid) * grid;
      y = Math.round(y / grid) * grid;
    }

    const dialogWidth = 288; // 72 * 4 (w-72)
    const dialogHeight = 128;

    x = Math.max(0, Math.min(window.innerWidth - dialogWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - dialogHeight, y));

    setPos({ x, y });
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

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
          className="z-[20000] w-72 cursor-move rounded-lg border-2 border-blue-300 bg-slate-800/95 p-4 font-mono text-white shadow-lg select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
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
