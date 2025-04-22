import React, { type ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

const Body: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="flex flex-col justify-around rounded-b-md border-x-2 border-b-2 px-2 pb-2">
      {children}
    </div>
  );
};

export default Body;
