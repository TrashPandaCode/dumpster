import { useRef } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/lib/core/components/Carousel";
import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";
import LevelCard from "~/lib/core/components/LevelCard";
import PlayButton from "~/lib/core/components/PlayButton";
import { LEVELS } from "~/lib/game/core/levels";
import arrowDownIcon from "../assets/arrow_down.svg";

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
          className="absolute bottom-8 left-1/2 z-1 w-6 cursor-pointer transition-transform hover:translate-y-1"
          src={arrowDownIcon}
          onClick={scrollToTarget}
          alt="Scroll down"
        />

        <main className="relative flex h-full flex-col items-center justify-evenly overflow-hidden">
          <div className="flex flex-col items-center">
            <h1 className="font-pixel text-9xl font-bold text-white">
              Dumpster Diving
            </h1>
            <hr className="my-6 h-1 w-100 rounded-sm border-0 bg-white" />
            <p className="w-200 text-center text-white">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non
              sequi eum, quaerat dignissimos enim quos laborum magnam
              exercitationem in eos eius incidunt blanditiis illo iusto deserunt
              reiciendis numquam. Quas, facilis?
            </p>
            <PlayButton />
          </div>

          <Carousel className="max-w-8/10">
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
              Raiding The <br />
              Trash
            </div>
          </div>
        </div>
      </section>
      <section className="flex h-96 items-center justify-center bg-slate-800">
        <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4">
          <h1 className="font-pixel text-4xl font-bold text-white">
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
