import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const CustomDialog = ({
  title,
  trigger,
  defaultOpen,
  children,
}: {
  title: string;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-slate-800/25" />
        <DialogContent className="fixed top-1/2 left-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg border-3 border-blue-300 bg-slate-800/95 p-8 font-mono text-white">
          <DialogTitle className="text-center text-4xl font-bold capitalize">
            {title}
          </DialogTitle>

          {children}

          <DialogClose asChild>
            <button
              className="absolute top-2.5 right-2.5 inline-flex size-[25px] cursor-pointer appearance-none items-center justify-center rounded-full bg-slate-700 focus:outline-1 focus:outline-blue-300"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CustomDialog;
