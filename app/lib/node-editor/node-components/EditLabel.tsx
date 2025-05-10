import { useState } from "react";

const EditLabel = ({ label }: { label: string }) => {
  const [text, setText] = useState(label);

  return (
    <>
      <input
        className="nodrag rounded font-bold focus:outline-1 focus:outline-slate-500"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </>
  );
};

export default EditLabel;
