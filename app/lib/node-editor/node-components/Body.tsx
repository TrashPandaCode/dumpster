import React, { type ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

const Body: React.FC<HeaderProps> = ({ children }) => {
  return <div className="border-x-2 px-2">{children}</div>;
};

export default Body;
