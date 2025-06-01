import { NavLink } from "react-router";

import type { Level } from "~/lib/game/core/levels";

const LevelCard: React.FC<{ level: Level }> = ({ level }) => (
  <NavLink
    to={`/game/${level.slug}`}
    className="group relative flex aspect-square cursor-pointer overflow-hidden rounded-xl"
  >
    <div className="absolute z-1 m-2 flex gap-3">
      {Array.from({ length: level.difficulty }, () => (
        <div className="h-5 w-5 rounded-full bg-white" />
      ))}
    </div>
    <div className="font-pixel bg-jam-600 absolute bottom-0 z-1 flex h-10 w-full items-center justify-center p-1 text-center text-2xl text-white transition-all duration-300 group-hover:h-12">
      {level.name}
    </div>
    <img
      className="h-full w-full scale-110 object-cover"
      src={level.image}
      alt=""
    />
  </NavLink>
);

export default LevelCard;
