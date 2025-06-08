import { CheckCircledIcon } from "@radix-ui/react-icons";
import { NavLink } from "react-router";

import difficultyOneImage from "~/assets/D1.png";
import difficultyTwoImage from "~/assets/D2.png";
import difficultyThreeImage from "~/assets/D3.png";
import type { Level } from "~/lib/game/core/levels";

const LevelCard: React.FC<{ level: Level }> = ({ level }) => (
  <NavLink
    to={`/levels/${level.slug}`}
    className="group relative flex aspect-square cursor-pointer overflow-hidden rounded-xl"
  >
    <div className="absolute z-1 m-2 flex items-center justify-center gap-[1px] rounded-full bg-white px-1 py-0.5">
      {level.difficulty > 0 ? (
        <img
          className="pixelate -mt-1 h-5 w-5"
          src={difficultyOneImage}
          alt="Difficulty 2"
        />
      ) : (
        <img
          className="pixelate -mt-1 h-5 w-5 opacity-40"
          src={difficultyOneImage}
          alt="Difficulty 1"
        />
      )}

      {level.difficulty > 1 ? (
        <img
          className="pixelate -mt-1 h-5 w-5"
          src={difficultyTwoImage}
          alt="Difficulty 2"
        />
      ) : (
        <img
          className="pixelate -mt-1 h-5 w-5 opacity-40"
          src={difficultyOneImage}
          alt="Difficulty 1"
        />
      )}

      {level.difficulty > 2 ? (
        <img
          className="pixelate -mt-1 h-5 w-5"
          src={difficultyThreeImage}
          alt="Difficulty 3"
        />
      ) : (
        <img
          className="pixelate -mt-1 h-5 w-5 opacity-40"
          src={difficultyOneImage}
          alt="Difficulty 1"
        />
      )}
    </div>

    {JSON.parse(localStorage.getItem(`game-store-${level.slug}`) ?? "{}")
      .levelCompleted && (
      <div className="absolute top-0 right-0 z-1 aspect-square w-11 bg-white [clip-path:polygon(100%_100%,0_0,100%_0)]">
        <CheckCircledIcon className="absolute top-1.5 right-1.5 text-green-700" />
      </div>
    )}

    <div className="font-pixel absolute top-6 z-1 m-2 flex items-center justify-center rounded-full bg-white px-2 py-0.5 text-[11px]">
      {level.category}
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
