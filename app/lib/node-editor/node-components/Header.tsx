import React, { type ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return <h2 className="rounded-t-md border-2 px-2">{children}</h2>;
};

export default Header;
