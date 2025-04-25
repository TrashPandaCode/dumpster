import { type ReactNode } from "react";

const NodeContent = ({
  label,
  type,
  children,
}: {
  label: string;
  type: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col justify-around rounded-sm border-1 border-blue-300 bg-slate-800 pb-3 font-mono text-white">
      <div className="p-3">
        <h2 className="font-bold">{label}</h2>
        <p className="text-xs italic">{type}</p>
      </div>
      {children}
    </div>
  );
};

export default NodeContent;
