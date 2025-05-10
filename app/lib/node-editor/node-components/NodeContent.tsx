import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { type ReactNode } from "react";
import { NavLink } from "react-router";

const modules = import.meta.glob("/content/**/*.md");

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
  active = false,
  isGroup = false,
  children,
}: {
  label: string;
  type: string;
  name?: string;
  active?: boolean;
  isGroup?: boolean;
  children?: ReactNode;
}) => {
  return (
    <div
      className={classnames(
        "flex flex-col rounded-sm border-1 pb-3 font-mono text-white",
        active
          ? "border-emerald-400 outline-2 outline-emerald-400"
          : "border-blue-300",
        isGroup && "h-full bg-slate-900"
      )}
    >
      <div className="flex items-start justify-between p-3">
        <div>
          <h2 className="font-bold">{label}</h2>
          <p className="text-xs italic">{type}</p>
        </div>

        {label !== "Select Math Type" && (
          <NavLink target="_blank" to={`/docs/nodes/${label.toLowerCase()}`}>
            <QuestionMarkCircledIcon className="cursor-pointer text-slate-400" />
          </NavLink>
        )}
      </div>
      <div className="flex h-full w-full flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

export default NodeContent;
