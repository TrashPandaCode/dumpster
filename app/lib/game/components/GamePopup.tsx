import { Dialog } from "@radix-ui/react-dialog";

import CustomDialog from "./CustomDialog";

const GamePopup = () => {
  return (
    <Dialog defaultOpen={true}>
      <CustomDialog />
    </Dialog>
  );
};

export { GamePopup };
