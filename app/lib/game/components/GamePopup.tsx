import { Dialog } from "@radix-ui/react-dialog";

import { LEVELS } from "~/lib/game/core/levels";
import { useGameStore } from "~/lib/zustand/game";
import CustomDialog from "./CustomDialog";

const GamePopup = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);

  const descriptions = LEVELS[currentLevel]?.description || [
    "No description available for this level.",
  ];

  return (
    <Dialog defaultOpen={true}>
      <CustomDialog
        type="level"
        text={descriptions}
        title={currentLevel}
        buttonText={"Let's Start!"}
      />
    </Dialog>
  );
};

export { GamePopup };
