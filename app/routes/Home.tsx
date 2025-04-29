import React, { useRef, useState } from "react";
import { NavLink } from "react-router";

import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";
import PlayButton from "~/lib/core/components/PlayButton";
import alleyOne from "../assets/alley_one.jpg";
import alleyTwo from "../assets/alley_two.png";
import arrowDownIcon from "../assets/arrow_down.svg";
import houseImage from "../assets/house.png";


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
  const [showAll, setShowAll] = useState(false);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const scrollToTarget = () => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />

        <img
          className="absolute bottom-8 left-1/2 z-1 w-6 cursor-pointer text-red-700 transition-transform hover:translate-y-1"
          src={arrowDownIcon}
          onClick={scrollToTarget}
          alt="Scroll down"
        />

        <main className="relative flex h-full overflow-hidden">
          <img
            className="pointer-events-none absolute z-[-1] h-full w-full scale-110 object-cover blur-lg"
            src={currentHoverCard.image}
            alt=""
          />

          <div className="h-full overflow-hidden p-12">
            <div className="grid h-full grid-cols-3 gap-12 overflow-hidden">
              <div className="h-full overflow-hidden rounded-xl bg-blue-950 p-4 text-white">
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
                <p className="text-sm">{currentHoverCard.description}</p>
              </div>
              <div className="col-span-2 col-start-2 flex h-[calc(100%)] flex-col">
                <div
                  className={`relative overflow-hidden transition-all duration-500`}
                  style={{
                    WebkitMaskImage: showAll
                      ? ""
                      : "linear-gradient(to bottom, black 60%, transparent 100%)",
                    maskImage: showAll
                      ? ""
                      : "linear-gradient(to bottom, black 60%, transparent 100%)",
                    height: showAll ? "85%" : "35%",
                  }}
                >
                  <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(200px,_1fr))] gap-4 overflow-hidden p-2">
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
                  <a
                    className="flex-1/2 cursor-pointer rounded-full bg-white px-4 py-2 text-center text-sm font-bold transition-transform"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "show less" : "show all"}
                  </a>
                  <div className="ml-[-2px] h-1 w-full rounded-r-full bg-white"></div>
                </div>

                <div
                  className={`p-2 transition-all duration-500 ${showAll ? "h-[0%] opacity-0" : "h-fit opacity-100"}`}
                >
                  <h1 className="font-pixel pt-6 text-6xl font-bold text-white">
                    <p className="">Dumpster</p>
                    <p>Diving</p>
                  </h1>
                  <br />
                  <p className="text-sm text-white">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>

                <PlayButton />
              </div>
            </div>
          </div>
        </main>
      </div>

      <section
        ref={scrollTargetRef}
        className="flex items-center justify-center bg-white"
      >
        <div className="flex h-full w-full flex-col p-12">
          <h1 className="font-fonm pb-12 text-4xl font-bold">
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
              Raiding The <br />
              Trash
            </div>
          </div>
        </div>
      </section>
      <section className="flex h-96 items-center justify-center bg-blue-950">
        <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4">
          <h1 className="font-fonm text-4xl font-bold text-white">
            Join the community
          </h1>
          <p className="text-center text-sm text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <a
            href="https://discord.gg/yourdiscordlink"
            className="bg-jam-600 hover:bg-jam-500 rounded-full px-6 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Join Discord
          </a>
        </div>
      </section>
      <section className="p-12">
        <h1 className="font-fonm text-4xl font-bold">About</h1>
        <p className="text-sm">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </section>
      <section className="bg-blue-950 p-12 text-white">
        <h1 className="font-fonm text-4xl font-bold">About</h1>
        <p className="text-sm">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </section>
      <Footer />
    </>
  );
};

const LevelCard: React.FC<{ img: string; onMouseEnter: () => void }> = ({
  img,
  onMouseEnter,
}) => (
  <div
    className="outline-jam-600 relative h-full w-full cursor-pointer overflow-hidden rounded-xl hover:outline-5"
    onMouseEnter={onMouseEnter}
  >
    <img className="h-full w-full scale-110 object-cover" src={img} alt="" />
  </div>
);

export default Home;
