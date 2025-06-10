import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const CustomDialog = ({
  title,
  trigger,
  defaultOpen,
  open,
  onOpenChange,
  desc,
  children,
}: {
  title: string;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  desc?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/25" />
        <DialogContent className="fixed top-1/2 left-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg border-2 border-blue-300 bg-slate-800/85 p-8 font-mono text-white">
          <VisuallyHidden asChild>
            <DialogDescription>{desc}</DialogDescription>
          </VisuallyHidden>
          <DialogTitle className="text-center text-4xl font-bold capitalize">
            {title}
          </DialogTitle>

          <div id="dialog">{children}</div>
          <DialogClose asChild>
            <button
              className="absolute top-2.5 right-2.5 inline-flex size-[25px] cursor-pointer appearance-none items-center justify-center rounded-full bg-slate-700 focus:outline-1 focus:outline-blue-300"
              aria-label="Close"
              onClick={handleClose}
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
