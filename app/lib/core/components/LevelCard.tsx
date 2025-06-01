import { NavLink } from "react-router";

import type { Level } from "~/lib/game/core/levels";

const LevelCard: React.FC<{ level: Level; onMouseEnter: () => void }> = ({
  level,
  onMouseEnter,
}) => (
  <NavLink
    to={`/game/${level.slug}`}
    className="outline-jam-600 relative h-full w-full cursor-pointer overflow-hidden rounded-xl hover:outline-5"
    onMouseEnter={onMouseEnter}
  >
    <div className="absolute z-1 m-5 flex gap-3">
      {Array.from({ length: level.difficulty }, (_) => (
        <div className="h-5 w-5 rounded-full bg-white" />
      ))}
    </div>
    <div className="font-pixel bg-jam-600 absolute bottom-0 z-1 w-full p-1 text-center text-2xl text-white">
      {level.category}
    </div>
    <img
      className="h-full w-full scale-110 object-cover"
      src={level.image}
      alt=""
    />
  </NavLink>
);

export default LevelCard;
