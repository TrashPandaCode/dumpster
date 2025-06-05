import classnames from "classnames";
import React from "react";
import { NavLink } from "react-router";

import playIcon from "~/assets/play.svg";

interface PlayButtonProps extends React.HTMLProps<HTMLAnchorElement> {
  className?: string;
}

const PlayButton = React.forwardRef<HTMLAnchorElement, PlayButtonProps>(
  ({ className, ...props }, ref) => {
    const prevLevel = localStorage.getItem("level");

    return (
      <NavLink
        to={prevLevel ? `/levels/${prevLevel}` : "/levels"}
        className={classnames(
          "bg-jam-600 font-pixel hover:bg-jam-700 mt-6 flex w-fit items-center justify-baseline gap-4 rounded-full px-8 py-2 text-4xl font-bold text-white shadow-lg transition-transform duration-200 hover:scale-103",
          className
        )}
        ref={ref}
        {...props}
      >
        Play
        <img src={playIcon} alt="" width={20} />
      </NavLink>
    );
  }
);

export default PlayButton;
