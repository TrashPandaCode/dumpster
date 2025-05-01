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
  name = "value",
  active = false,
  children,
}: {
  label: string;
  type: string;
  name?: string;
  active?: boolean;
  children?: ReactNode;
}) => {
  return (
    <div
      className={classnames(
        "flex flex-col justify-around rounded-sm border-1 pb-3 font-mono text-white",
        active
          ? "border-emerald-400 outline-2 outline-emerald-400"
          : "border-blue-300"
      )}
    >
      <div className="flex items-start justify-between p-3">
        <div>
          <h2 className="font-bold">{label}</h2>
          <p className="text-xs italic">{type}</p>
        </div>

        <NavLink target="_blank" to={`/docs/nodes/${type}`}>
          <QuestionMarkCircledIcon className="cursor-pointer text-slate-400" />
        </NavLink>
      </div>
      {children}
    </div>
  );
};

export default NodeContent;
