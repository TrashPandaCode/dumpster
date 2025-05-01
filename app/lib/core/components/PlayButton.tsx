import { NavLink } from "react-router";

import playIcon from "~/assets/play.svg";

const PlayButton = () => {
  return (
    <NavLink
      className="bg-jam-600 font-pixel absolute right-12 bottom-12 flex items-center justify-baseline gap-4 rounded-full px-6 py-3 text-4xl font-bold text-white shadow-lg transition-transform duration-200 hover:scale-103 hover:bg-jam-700"
      to="/game"
    >
      Play
      <img src={playIcon} alt="" width={20} />
    </NavLink>
  );
};

export default PlayButton;
