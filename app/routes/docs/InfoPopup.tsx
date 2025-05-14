import { useState } from "react";
import { useGameStore } from "~/lib/zustand/game";

const InfoPopup = ({
    isVisible,
    setIsVisible,
}: {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}) => {

    const currentLevel = useGameStore((state) => state.currentLevel);

    const levelDescriptions: Record<string, string[]> = {
        playground: [
            "Test all features freely.",
            "Experiment with different setups.",
            "No restrictions in this mode.",
        ],
        "1.1": [
            "Create a character controller for the raccoon.",
            "Navigate the raccoon to the goal flag.",
            "Avoid obstacles along the way.",
        ],
    };

    const description = levelDescriptions[currentLevel] || "No description available for this level.";

    if (!isVisible) {
        return null;
    }

    // Info popup
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col w-[50%] h-[50%] rounded-lg border-3 p-5 font-mono text-white bg-gray-800/95 border-blue-300">
                <div className="text-center mb-6 pt-8">
                    <h2 className="font-bold text-7xl">Level: {currentLevel}</h2>
                </div>
                <div className="flex flex-row flex-1">

                    {/* Goals Section */}
                    <div className="mb-4 pt-16 pl-24">
                        <h3 className="font-bold text-5xl text-left">Goals:</h3>
                        <ul className="list-disc list-inside mt-2 text-left pl-8">
                            {description.map((goal, index) => (
                                <li key={index} className="text-2xl italic">
                                    {goal}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Button to close the popup */}
                <div className="flex flex-col items-center justify-center mt-4 pb-8">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-4 py-2 outline-2 outline-emerald-400 text-white rounded hover:bg-emerald-400 cursor-pointer text-2xl"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export { InfoPopup };