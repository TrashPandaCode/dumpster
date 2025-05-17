import { useState } from "react";
import { useGameStore } from "~/lib/zustand/game";
import { LEVELS } from "~/lib/game/core/levels";

const InfoPopup = ({
    isVisible,
    setIsVisible,
}: {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}) => {

    const currentLevel = useGameStore((state) => state.currentLevel);

    const description =
        LEVELS[currentLevel]?.goals || "No goals defined for this level yet.";

    if (!isVisible) {
        return null;
    }

    // Info popup
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col w-1/2 max-h-[80vh] rounded-lg border-3 p-5 font-mono text-white bg-slate-800/95 border-blue-300">
                <div className="text-center mb-6 pt-4">
                    <h2 className="font-bold text-5xl">Level: {currentLevel}</h2>
                </div>
                <div className="flex flex-row flex-1 justify-center items-start">

                    {/* Goals Section */}
                    <div className="mb-4 pt-4 pb-8 w-2/3 max-w-xl">
                        <h3 className="font-bold text-3xl text-left">Goals:</h3>
                        <ul className="list-disc list-inside mt-2 text-left pl-8">
                            {description.map((goal) => (
                                <li key={goal.slice(0, 20)} className="text-lg italic">
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
                        className="px-4 py-2 outline-2 outline-jam-600 text-white rounded hover:bg-jam-600 cursor-pointer text-lg"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export { InfoPopup };