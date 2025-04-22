import React, { useState } from "react";
import { NavLink } from "react-router";

import alleyOne from "../assets/alley_one.jpg";
import alleyTwo from "../assets/alley_two.png";
import arrowDownIcon from "../assets/arrow_down.svg";
import houseImage from "../assets/house.png";
import playIcon from "../assets/play.svg";

const CARDS = [
  {
    id: 1,
    name: "Level 1",
    description: "This is level 1",
    image: houseImage,
  },
  {
    id: 2,
    name: "Level 2",
    description: "This is level 2",
    image: alleyOne,
  },
  {
    id: 3,
    name: "Level 3",
    description: "This is level 3",
    image: alleyTwo,
  },
  {
    id: 4,
    name: "Level 4",
    description: "This is level 4",
    image: houseImage,
  },
  {
    id: 5,
    name: "Level 5",
    description: "This is level 5",
    image: alleyOne,
  },
  {
    id: 6,
    name: "Level 6",
    description: "This is level 6",
    image: alleyTwo,
  },
];

const Home = () => {
  const [currentHoverCard, setCurrentHoverCard] = useState(CARDS[0]);
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
        <img
          className="pointer-events-none absolute bottom-12 left-1/2"
          src={arrowDownIcon}
        />
        <main className="relative flex flex-grow overflow-hidden">
          <img
            className="pointer-events-none absolute z-[-1] h-full w-full scale-110 object-cover blur-lg"
            src={currentHoverCard.image}
            alt=""
          />

          <div className="flex-grow overflow-auto p-12">
            <div className="grid h-full grid-cols-3 gap-12">
              <div className="rounded-xl bg-blue-950 p-4 text-white">
                <h1 className="font-pixel text-4xl font-bold">
                  {currentHoverCard.name}
                </h1>
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
                <br />
                <br />
                <br />
                <p className="text-sm">{currentHoverCard.description}</p>
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
                    {CARDS.map((card) => (
                      <LevelCard
                        key={card.id}
                        img={card.image}
                        onMouseEnter={() => {
                          setCurrentHoverCard(card);
                        }}
                      />
                    ))}
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
                  <img src={playIcon} alt="" className="h-5 w-5" />
                </NavLink>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section className="flex items-center justify-center bg-white">
        <div className="flex h-full w-full flex-col p-12">
          <h1 className="font-pixel pb-12 text-4xl font-bold">
            Learn these skills to become a dumpster diver
          </h1>
          <div className="flex items-start justify-center gap-32">
            <div className="flex flex-col gap-4 text-center">
              <div className="bg-jam-600 h-32 w-32 rounded-full" />
              Computer
              <br />
              Animation
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div className="bg-jam-600 h-32 w-32 rounded-full" />
              Eating Trash
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div className="bg-jam-600 h-32 w-32 rounded-full" />
              Raiding The <br />Trash
            </div>
          </div>
        </div>
      </section>
      <section className="flex h-96 items-center justify-center bg-blue-950">
        <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4">
          <h1 className="font-pixel text-4xl font-bold text-white">
            Join the community
          </h1>
          <p className="text-sm text-white text-center">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <a
            href="https://discord.gg/yourdiscordlink"
            className="bg-jam-600 rounded-full px-6 py-3 text-lg font-bold text-white"
          >
            Join Discord
          </a>
        </div>
      </section>
      <footer className="p-4 text-center text-black">
        <p>haha du hast das hier gelesen</p>
      </footer>
    </>
  );
};

const LevelCard: React.FC<{ img: string; onMouseEnter: () => void }> = ({
  img,
  onMouseEnter,
}) => (
  <div
    className="outline-jam-600 relative aspect-square h-full w-full cursor-pointer overflow-hidden rounded-xl hover:outline-2"
    onMouseEnter={onMouseEnter}
  >
    <img className="h-full w-full scale-110 object-cover" src={img} alt="" />
  </div>
);

export default Home;
