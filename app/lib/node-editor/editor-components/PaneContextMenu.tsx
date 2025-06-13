import React from "react";

import AddNodes from "./AddNodes";

const PaneContextMenu = React.forwardRef<
  HTMLDivElement,
  {
    x: number;
    y: number;
    onClose: () => void;
  }
>(({ x, y, onClose }, ref) => {
  return (
    <div
      ref={ref}
      style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}
    >
      <AddNodes onClose={onClose} x={x} y={y} />
    </div>
  );
});

export default PaneContextMenu;
