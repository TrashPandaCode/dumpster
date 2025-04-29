import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { type ReactNode } from "react";
import { NavLink } from "react-router";

const modules = import.meta.glob('/content/**/*.md');

const loadMarkdown = async (filename: string) => {
  const path = `/content/${filename}`;
  if (modules[path]) {
    const mod = await modules[path]();
    return mod;
  } else {
    throw new Error(`Markdown file not found: ${filename}`);
  }
};

const NodeContent = ({
  label,
  type,
  name = "value",
  highlight = false,
  children,
}: {
  label: string;
  type: string;
  name?: string;
  highlight?: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      className={classnames(
        "flex flex-col justify-around rounded-sm border-1 border-blue-300 pb-3 font-mono text-white",
        highlight ? "bg-slate-700" : "bg-slate-800"
      )}
    >
      <div className="flex items-start justify-between p-3">
        <div>
          <h2 className="font-bold">{label}</h2>
          <p className="text-xs italic">{type}</p>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="">
              <QuestionMarkCircledIcon className="cursor-pointer text-slate-400" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-slate-950/20" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-blue-300 bg-slate-900 p-[25px] focus:outline-none">
              {/* TODO: Add Dialog.Title for accessibility; fetch from md */}
              
              <Dialog.Description className="prose prose-slate prose-invert py-2">
                {/* TODO: maybe use suspend */}
                {/* TODO: remove wrapping div from ReactComponent */}
                {loadMarkdown(`nodes/${name}.md`).then((module) => {
                  const { ReactComponent } = module as any;
                  return <ReactComponent />;
                })}

                <NavLink className="underline pt-4 text-slate-400" target="_blank" to="/docs/">learn more</NavLink>
              </Dialog.Description>

              <Dialog.Close asChild>
                <button
                  className="bg-gray3 absolute top-2.5 right-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-slate-200 focus:shadow-[0_0_0_2px]"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      {children}
    </div>
  );
};

export default NodeContent;
