import React, { useState } from "react";

const NumberInput = ({ setValue }: { setValue(input: number): void }) => {
  const [rawValue, setRawValue] = useState("0");

  const parseNumber = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const input = evt.target.value.replace(",", ".");
    setRawValue(input);

    const parsed = Number(input);
    if (!isNaN(parsed)) {
      setValue(parsed);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      onChange={parseNumber}
      className="nodrag mx-3 bg-amber-300"
      value={rawValue}
    />
  );
};

export default NumberInput;
