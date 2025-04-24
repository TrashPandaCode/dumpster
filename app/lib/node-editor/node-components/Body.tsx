import React, { type ReactNode } from "react";

// TODO: das hier auslagern?
// Leo: nö macht man meist in der selben datei
type HeaderProps = {
  children?: ReactNode;
};

const Body: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="flex rounded-sm rounded-t-none flex-col justify-around border-1 border-t-0 border-blue-300 bg-slate-800 font-mono text-white py-3">
      {children}
    </div>
  );
};

export default Body;
