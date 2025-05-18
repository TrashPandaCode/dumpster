import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { LEVELS } from "~/lib/game/core/levels";
import { useGameStore } from "~/lib/zustand/game";
import CustomDialog from "./CustomDialog";

const InfoPopup = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);

  const goals = LEVELS[currentLevel]?.goals || [
    "No goals defined for this level yet.",
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900">
          <InfoCircledIcon className="text-white" />
        </button>
      </DialogTrigger>
      <CustomDialog
        type="info"
        text={goals}
        title={currentLevel}
        buttonText={"Continue"}
      />
    </Dialog>
  );
};

export { InfoPopup };
