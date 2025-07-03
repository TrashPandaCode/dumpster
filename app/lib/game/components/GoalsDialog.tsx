/*
 * Authors: Leo Kling, Markus Heming
 *
 * Purpose: This component displays the goals for the current level in a draggable dialog.
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useRef, useState } from "react";

import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "../core/levels";

/**
 * GoalsDialog component displays the goals for the current level.
 * It allows users to drag the dialog around the screen.
 * The dialog can be opened or closed based on the `open` prop.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 */
export default function GoalsDialog({ open }: { open: boolean }) {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const goals = LEVELS[currentLevel]?.goals || [
    "No goals defined for this level yet.",
  ];

  const [pos, setPos] = useState({ x: 16, y: 16 });

  const dialogRef = useRef<HTMLDivElement>(null);
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

    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current.isDragging) return;

    let x = e.clientX - dragRef.current.offset.x;
    let y = e.clientY - dragRef.current.offset.y;

    if (e.shiftKey) {
      const grid = 16;
      x = Math.round(x / grid) * grid;
      y = Math.round(y / grid) * grid;
    }

    const dialogWidth = dialogRef.current?.offsetWidth ?? 288;
    const dialogHeight = dialogRef.current?.offsetHeight ?? 128;

    x = Math.max(0, Math.min(window.innerWidth - dialogWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - dialogHeight, y));

    setPos({ x, y });
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  return (
    <Dialog open={open} modal={false}>
      <DialogPortal>
        <DialogContent
          ref={dialogRef}
          style={{
            left: pos.x,
            top: pos.y,
            position: "fixed",
            margin: 0,
          }}
          className="z-[20000] w-72 cursor-move rounded-lg border-2 border-blue-300 bg-slate-800/95 p-4 font-mono text-white shadow-lg select-none"
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
