import {
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const CustomDialog = ({
  title,
  text,
  buttonText,
  type,
}: {
  title: string;
  text: string[];
  buttonText: string;
  type: "level" | "info";
}) => {
  return (
    <DialogPortal>
      {/* <DialogOverlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-slate-800/25" /> */}
      <DialogContent className="fixed top-1/2 left-1/2 flex min-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg border-3 border-blue-300 bg-slate-800/95 p-5 py-8 font-mono text-white">
        <DialogTitle className="text-center text-5xl font-bold capitalize">
          Level: {title}
        </DialogTitle>
        {type === "level" && <GameInner descriptions={text} />}
        {type === "info" && <InfoInner goals={text} />}

        <DialogClose asChild>
          <button className="outline-jam-600 hover:bg-jam-600 m-auto w-fit cursor-pointer rounded px-4 py-2 text-lg text-white outline-2">
            {buttonText}
          </button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  );
};

export default CustomDialog;

const GameInner = ({ descriptions }: { descriptions: string[] }) => {
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  const description = descriptions[index];

  // Typing effect
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index <= description.length) {
        setTypedText(description.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => {
      clearInterval(interval);
      setTypedText("");
    };
  }, [description]);

  return (
    <div className="flex flex-1 flex-row">
      {/* Left side: Raccoon sprite */}
      <div className="w-1/3 pr-4">
        <div
          style={{
            aspectRatio: "1 / 1",
            width: "100%",
            backgroundImage: "url('/game/sprites/raccoon_spritesheet.png')",
            backgroundPosition: "0 0",
            backgroundSize: "400% 400%",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        ></div>
      </div>

      {/* Right side: Description text */}
      <div className="my-auto flex w-3/4 flex-col text-left">
        <div className="relative w-fit rounded-lg bg-slate-700 p-4 text-white shadow-lg">
          <div className="absolute top-1/2 -left-2 h-0 w-0 -translate-y-1/2 border-t-10 border-r-10 border-b-10 border-t-transparent border-r-slate-700 border-b-transparent"></div>
          <p className="text-lg italic">{typedText}</p>
        </div>
        {index !== descriptions.length - 1 && (
          <TriangleDownIcon
            onClick={() => setIndex(index + 1)}
            className="mx-auto size-10 cursor-pointer text-slate-400"
          />
        )}
      </div>
    </div>
  );
};

const InfoInner = ({ goals }: { goals: string[] }) => {
  return (
    <div className="flex flex-1 flex-row items-start justify-center">
      {/* Goals Section */}
      <div className="w-2/3 max-w-xl">
        <h3 className="text-left text-3xl font-bold">Goals:</h3>
        <ul className="list-inside list-disc pt-2 pl-8 text-left">
          {goals.map((goal) => (
            <li key={goal.slice(0, 20)} className="text-lg italic">
              {goal}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
