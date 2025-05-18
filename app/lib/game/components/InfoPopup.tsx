import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import CustomDialog from "./CustomDialog";

const InfoPopup = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer rounded bg-slate-800 p-2 outline outline-slate-500 hover:bg-slate-900">
          <InfoCircledIcon className="text-white" />
        </button>
      </DialogTrigger>
      <CustomDialog skip={true} />
    </Dialog>
  );
};

export { InfoPopup };
