import { toast as sonnerToast } from "sonner";

export function toast(toast: ToastProps) {
  return sonnerToast.custom(() => (
    <Toast title={toast.title} description={toast.description} />
  ));
}

function Toast(props: ToastProps) {
  const { title, description } = props;

  return (
    <div className="flex w-full items-center rounded-md bg-slate-800 p-2 font-mono text-white outline outline-slate-500 md:max-w-[364px]">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="pt-1 text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  title: string;
  description: string;
}
