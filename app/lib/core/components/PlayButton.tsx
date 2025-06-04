import { NavLink } from "react-router";

import playIcon from "~/assets/play.svg";

const PlayButton = () => {
  const prevLevel = localStorage.getItem("level");
  console.log(prevLevel);

  return (
    <NavLink
      className="bg-jam-600 font-pixel hover:bg-jam-700 mt-6 flex w-fit items-center justify-baseline gap-4 rounded-full px-8 py-2 text-4xl font-bold text-white shadow-lg transition-transform duration-200 hover:scale-103"
      to={prevLevel ? `/levels/${prevLevel}` : "/levels"}
    >
      Play
      <img src={playIcon} alt="" width={20} />
    </NavLink>
  );
};

export default PlayButton;
