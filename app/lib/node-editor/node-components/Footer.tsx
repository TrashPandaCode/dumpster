import React, { type ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

const Footer: React.FC<HeaderProps> = ({ children }) => {
  return <div className="rounded-b-md border-2 px-2 text-sm">{children}</div>;
};

export default Footer;
