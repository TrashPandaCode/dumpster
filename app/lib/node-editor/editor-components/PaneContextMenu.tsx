import React from "react";

import AddNodesPanel from "./AddNodesPanel";

type PaneContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
};

const PaneContextMenu: React.FC<PaneContextMenuProps> = ({ x, y, onClose }) => {
  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <AddNodesPanel onClose={onClose} x={x} y={y} />
    </div>
  );
};

export default PaneContextMenu;
