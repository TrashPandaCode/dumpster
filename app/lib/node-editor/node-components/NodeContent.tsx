import classnames from "classnames";
import { type ReactNode } from "react";

const NodeContent = ({
  label,
  type,
  active = false,
  children,
}: {
  label: string;
  type: string;
  active?: boolean;
  children: ReactNode;
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
      <div className="p-3">
        <h2 className="font-bold">{label}</h2>
        <p className="text-xs italic">{type}</p>
      </div>
      {children}
    </div>
  );
};

export default NodeContent;
