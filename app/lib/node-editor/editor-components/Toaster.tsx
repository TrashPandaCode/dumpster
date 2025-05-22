import * as Toast from "@radix-ui/react-toast";
import React from "react";

import { useToastStore } from "../node-store/toast-store";

const Toaster = () => {
  const { open, title, description, closeToast } = useToastStore();
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={closeToast}
        className="rounded-md bg-gray-800 p-4 text-white shadow-lg"
      >
        <Toast.Title className="font-bold">{title}</Toast.Title>
        <Toast.Description>{description}</Toast.Description>
        <Toast.Close className="absolute top-2 right-2">Close</Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 bottom-0 z-[9999] m-4" />
    </Toast.Provider>
  );
};

export default Toaster;
