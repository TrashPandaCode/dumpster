import React from "react";

import AddNodes from "./AddNodes";

type PaneContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
};

const PaneContextMenu: React.FC<PaneContextMenuProps> = ({ x, y, onClose }) => {
  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <AddNodes onClose={onClose} x={x} y={y} />
    </div>
  );
};

export default PaneContextMenu;
