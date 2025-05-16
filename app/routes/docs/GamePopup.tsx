import { useState, useEffect } from "react";
import { useGameStore } from "~/lib/zustand/game";

const GamePopup = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [typedText, setTypedText] = useState("");

    const currentLevel = useGameStore((state) => state.currentLevel);

    const levelDescriptions: Record<string, string> = {
        playground: "In the playground, you have access to all features and can freely test everything.",
        "1.1": "Your goal is to create a character controller for the raccoon and navigate it to the goal flag.",
    };

    const description = levelDescriptions[currentLevel] || "No description available for this level.";

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

    if (!isVisible) {
        return null;
    }

    // Game popup
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col w-[50%] max-h-[80vh] rounded-lg border-3 p-5 font-mono text-white bg-gray-800/95 border-blue-300">
                <div className="text-center mb-6 pt-4">
                    <h2 className="font-bold text-5xl">Level: {currentLevel}</h2>
                </div>
                <div className="flex flex-row flex-1">

                    {/* Left side: Raccoon sprite */}
                    <div className="flex items-center justify-center w-[30%]">
                        <div
                            className="w-64 h-64"
                            style={{
                                backgroundImage: "url('/game/sprites/raccoon_spritesheet.png')",
                                backgroundPosition: "0 0",
                                backgroundSize: "400% 400%",
                                imageRendering: "pixelated",

                            }}
                        ></div>
                    </div>

                    {/* Right side: Description text */}
                    <div className="flex items-center w-[70%] text-center pr-16">
                        <div className="relative bg-gray-700 text-white p-4 rounded-lg shadow-lg">
                            <div className="absolute w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-gray-700"
                                style={{ top: "50%", left: "-10px", transform: "translateY(-50%)" }}
                            ></div>
                            <p className="text-lg italic">{typedText}</p>
                        </div>
                    </div>
                </div>

                {/* Button to close the popup */}
                <div className="flex flex-col items-center justify-center mt-4 pb-8">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-4 py-2 outline-2 outline-emerald-400 text-white rounded hover:bg-emerald-400 cursor-pointer text-lg"
                    >
                        Let's Start!
                    </button>
                </div>
            </div>
        </div>
    );
};

export { GamePopup };