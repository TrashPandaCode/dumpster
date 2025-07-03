/*
 * Authors: Jonathan Kron, Leo Kling, Milan Jezovsek
 *
 * Purpose:
 * This React component renders the home page of an educational game website,
 * featuring a header, footer, interactive level selection carousel, informational sections about the game, and links to documentation pages.
 */
import { useRef } from "react";
import { NavLink } from "react-router";

import arrowDownIcon from "~/assets/arrow_down.svg";
import caRaccoon from "~/assets/home/ca_raccoon.png";
import eatingTrash from "~/assets/home/eating_trash.png";
import raidTrash from "~/assets/home/raid_trash.png";
import raccoonImage from "~/assets/raccoon.png";
import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/lib/core/home/components/Carousel";
import LevelCard from "~/lib/core/home/components/LevelCard";
import PlayButton from "~/lib/core/home/components/PlayButton";
import { LEVELS } from "~/lib/game/core/levels";

const Home = () => {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const scrollToTarget = () => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <img
          className="absolute bottom-8 left-1/2 z-1 hidden w-6 cursor-pointer transition-transform hover:translate-y-1 md:block"
          src={arrowDownIcon}
          onClick={scrollToTarget}
          alt="Scroll down"
        />

        <main className="relative flex h-full flex-col items-center justify-evenly overflow-hidden">
          <div className="flex flex-col items-center">
            <h1 className="font-pixel scale-50 px-4 text-center text-9xl font-bold text-white md:scale-100">
              Dumpster Diving
            </h1>
            <hr className="my-6 h-1 w-full max-w-sm rounded-sm border-0 bg-white md:max-w-3xl" />
            <p className="max-w-xs text-center text-white md:max-w-3xl">
              Help our raccoon collect trash by solving puzzles and learning
              animation principles. Control every action with an intuitive
              node-based system and bring our small friend's world to life!
            </p>
            <PlayButton className="hidden md:flex" />
            <NavLink
              to="/docs"
              className="bg-jam-600 font-pixel hover:bg-jam-700 mt-6 flex w-fit items-center justify-baseline gap-4 rounded-full px-8 py-2 text-2xl font-bold text-white shadow-lg transition-transform duration-200 hover:scale-103 md:hidden"
            >
              Read the Docs
            </NavLink>
          </div>

          <Carousel className="max-w-2/3 md:max-w-8/10">
            <CarouselContent className="-ml-1">
              {Object.values(LEVELS).map((level, index) => (
                <CarouselItem key={index} className="basis-60 rounded-xl pl-1">
                  <div className="p-1">
                    <LevelCard level={level} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <img
            className="pointer-events-none absolute z-[-1] h-full w-full scale-110 object-cover blur-md"
            src="/game/backgrounds/background_calculator.png"
            alt=""
          />
        </main>
      </div>

      <section
        ref={scrollTargetRef}
        className="flex items-center justify-center bg-white"
      >
        <div className="flex h-full w-full flex-col items-center p-12">
          <h2 className="font-pixel pb-12 text-4xl font-bold">
            Learn these skills to become a dumpster diver
          </h2>
          <div className="flex flex-col items-start justify-center gap-10 md:flex-row md:gap-32">
            <div className="flex flex-col gap-4 text-center">
              <div className="bg-jam-600 h-32 w-32 rounded-full">
                <img className="rounded-b-full" src={caRaccoon} alt="" />
              </div>
              Computer
              <br />
              Animation
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div className="bg-jam-600 h-32 w-32 rounded-full">
                <img className="rounded-b-full" src={raidTrash} alt="" />
              </div>
              Raiding The <br />
              Trash
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div className="bg-jam-600 h-32 w-32 rounded-full">
                <img className="rounded-b-full" src={eatingTrash} alt="" />
              </div>
              Eating Trash
            </div>
          </div>
        </div>
      </section>
      <section className="flex h-96 w-full items-center justify-around bg-slate-800">
        <div className="flex flex-col items-start justify-center gap-10 md:flex-row md:gap-32">
          <img
            className="pixelate hidden w-60 pl-10 md:flex"
            src={raccoonImage}
            alt=""
          />
        </div>
        <div className="flex h-full w-full max-w-2xl flex-col items-start justify-center gap-4 p-4 text-white">
          <h2 className="font-pixel text-4xl font-bold">Welcome to the game</h2>
          <p>
            Welcome to our educational game about computer animation! This
            project is designed to help you explore and understand key concepts
            in animation, game logic, and interactive systems through hands-on
            experimentation.
          </p>
        </div>
      </section>
      <section className="flex h-96 w-full items-center justify-around bg-white">
        <div className="flex h-full w-full max-w-2xl flex-col items-start justify-center gap-4 p-4">
          <h2 className="font-pixel text-4xl font-bold">How to play</h2>
          <p>
            In this game, you use a visual node editor to build logic, control
            game objects, and solve creative puzzles. Each level introduces new
            mechanics and concepts, from basic value manipulation to more
            advanced topics such as conditional logic, movement, and more.
          </p>
        </div>
        <div className="flex flex-col items-start justify-center gap-10 md:flex-row md:gap-32">
          <img
            className="pixelate hidden w-60 -scale-x-100 pl-10 md:flex"
            src="/game/sprites/soap.png"
            alt=""
          />
        </div>
      </section>
      <section className="flex h-96 items-center justify-center bg-slate-800">
        <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4 p-4">
          <h2 className="font-pixel text-4xl font-bold text-white">
            Join the community
          </h2>
          <p className="text-center text-sm text-white">
            Join our student Discord to connect with other Mediatechnology
            students, share your experiences, and get help with the game.
            Whether you're a beginner or a seasoned player, there's a place for
            you in our community!
          </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/dn29RWwbS4"
            className="bg-jam-600 hover:bg-jam-700 rounded-full px-6 py-3 text-lg font-bold text-white transition-all duration-300"
          >
            Join Discord
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
