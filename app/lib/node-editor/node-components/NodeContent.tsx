import classnames from "classnames";
import { type ReactNode } from "react";

const NodeContent = ({
  label,
  type,
  highlight = false,
  children,
}: {
  label: string;
  type: string;
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
      <div className="p-3">
        <h2 className="font-bold">{label}</h2>
        <p className="text-xs italic">{type}</p>
      </div>
      {children}
    </div>
  );
};

export default NodeContent;
