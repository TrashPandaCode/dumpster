import React, { type ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="rounded-t-sm p-3 border-1 border-b-0 border-blue-300 bg-slate-800 font-mono text-white">
      <h2 className="font-bold">{children}</h2>
      <p className="italic text-xs">float</p>
    </div>
  );
};

export default Header;
