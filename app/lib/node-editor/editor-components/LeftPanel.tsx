import { InfoCircledIcon, PauseIcon, PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { Panel } from "@xyflow/react";
import { InfoPopup } from "~/routes/docs/InfoPopup";

import { useGameStore } from "~/lib/zustand/game";
import { useState } from "react";

const LeftPanel = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const play = useGameStore((state) => state.play);
  const pause = useGameStore((state) => state.pause);

  const [isInfoPopupVisible, setIsInfoPopupVisible] = useState(false);

  return (
    <Panel
      position="top-left"
      className="flex flex-col items-center justify-center gap-2"
    >
      <button
        onClick={() => {
          if (isPaused) {
            play();
          } else {
            pause();
          }
        }}
        className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900"
      >
        {isPaused ? (
          <PlayIcon className="text-white" />
        ) : (
          <PauseIcon className="text-white" />
        )}
      </button>
      <button className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900">
        <ResetIcon className="text-white" />
      </button>
      <button
        onClick={() => setIsInfoPopupVisible(true)}
        className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900"
      >
        <InfoCircledIcon className="text-white" />
      </button>

      {isInfoPopupVisible && (
        <InfoPopup
          isVisible={isInfoPopupVisible}
          setIsVisible={setIsInfoPopupVisible}
        />
      )}
    </Panel>
  );
};

export default LeftPanel;
