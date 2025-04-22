import { NavLink } from "react-router";

import arrowDownIcon from "../assets/arrow_down.svg";
import houseImage from "../assets/house.png";
import playIcon from "../assets/play.svg";

const Home = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header>
          <nav className="flex items-center gap-8 p-4">
            <div className="font-pixel text-xl font-bold">Dumpster Diving</div>
            <NavLink to="/docs">Docs</NavLink>
            <NavLink to="/game">Game</NavLink>
          </nav>
        </header>
        <img className="absolute bottom-12 left-1/2 pointer-events-none" src={arrowDownIcon}/>
        <main className="relative flex flex-grow overflow-hidden">
          <img
            className="pointer-events-none absolute z-[-1] h-full w-full scale-110 object-cover blur-lg"
            src={houseImage}
            alt=""
          />

          <div className="flex-grow overflow-auto p-12">
            <div className="grid h-full grid-cols-3 gap-12">
              <div className="rounded-xl bg-blue-950 p-4 text-white">
                <h1 className="font-pixel text-4xl font-bold">Overview</h1>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
              <div className="col-span-2 col-start-2 flex flex-col">
                <div
                  className="relative max-h-[350px] overflow-hidden"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 60%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 60%, transparent 100%)",
                  }}
                >
                  <div className="grid w-full grid-cols-4 gap-4">
                    <LevelCard />
                    <LevelCard />
                    <LevelCard />
                    <LevelCard />
                    <LevelCard />
                    <LevelCard />
                    <LevelCard />
                    <LevelCard />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="mr-[-2px] h-1 w-full rounded-l-full bg-white"></div>
                  <a className="flex-1/2 rounded-full bg-white px-4 py-2 text-center text-sm font-bold">
                    show all
                  </a>
                  <div className="ml-[-2px] h-1 w-full rounded-r-full bg-white"></div>
                </div>

                <h1 className="font-pixel pt-16 text-7xl font-bold text-white">
                  <p>Dumpster</p>
                  <p>Diving</p>
                </h1>
                <NavLink
                  className="bg-jam-600 font-pixel absolute right-12 bottom-12 flex items-center gap-2 rounded-full px-6 py-3 text-4xl font-bold text-white shadow-lg"
                  to="/game"
                >
                  Play
                  <img src={playIcon} alt="" className="pixel h-5 w-5" />
                </NavLink>
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="p-4 text-center text-black">
        <p>haha du hast das hier gelesen</p>
      </footer>
    </>
  );
};

const LevelCard = () => (
  <div className="relative aspect-square h-full w-full overflow-hidden rounded-xl">
    <img
      className="h-full w-full scale-110 object-cover"
      src={houseImage}
      alt=""
    />
  </div>
);

export default Home;
