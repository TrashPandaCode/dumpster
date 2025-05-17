import { useState, useEffect } from "react";
import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "~/lib/game/core/levels";

const GamePopup = ({ onClose }: { onClose: () => void }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [typedText, setTypedText] = useState("");

    const currentLevel = useGameStore((state) => state.currentLevel);

    const description =
        LEVELS[currentLevel]?.description || "No description available for this level.";

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

    useEffect(() => {
        if (!isVisible) {
            onClose();
        }
    }, [isVisible, onClose]);

    if (!isVisible) {
        return null;
    }

    // Game popup
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col w-1/2 max-h-[80vh] rounded-lg border-3 p-5 font-mono text-white bg-slate-800/95 border-blue-300">
                <div className="text-center mb-6 pt-4">
                    <h2 className="font-bold text-5xl">Level: {currentLevel}</h2>
                </div>
                <div className="flex flex-row flex-1">

                    {/* Left side: Raccoon sprite */}
                    <div className="flex items-center justify-center w-1/3 pr-4">
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
                    <div className="flex items-center w-3/4 text-center pr-16">
                        <div className="relative bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                            <div
                                className="absolute w-0 h-0 border-t-10 border-t-transparent border-b-10 border-b-transparent border-r-10 border-r-slate-700 top-1/2 -left-2 -translate-y-1/2"
                            ></div>
                            <p className="text-lg italic">{typedText}</p>
                        </div>
                    </div>
                </div>

                {/* Button to close the popup */}
                <div className="flex flex-col items-center justify-center mt-4 pb-8">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-4 py-2 outline-2 outline-jam-600 text-white rounded hover:bg-jam-600 cursor-pointer text-lg"
                    >
                        Let's Start!
                    </button>
                </div>
            </div>
        </div>
    );
};

export { GamePopup };