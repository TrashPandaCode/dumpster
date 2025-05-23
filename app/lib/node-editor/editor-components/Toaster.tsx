import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

import { useToastStore } from "../node-store/toast-store";

const Toaster = () => {
  const { open, title, description, closeToast, pauseClose, resumeClose } =
    useToastStore();
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={closeToast}
        className="max-w-[35vw] rounded-md bg-slate-800 p-2 text-white outline outline-slate-500"
        onMouseEnter={pauseClose}
        onMouseLeave={resumeClose}
      >
        <Toast.Title className="font-bold">{title} ⚠️</Toast.Title>
        <Toast.Description>{description}</Toast.Description>
        <Toast.Close className="absolute top-2 right-2">
          <Cross2Icon />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 bottom-0 z-[9999] m-4" />
    </Toast.Provider>
  );
};

export default Toaster;
