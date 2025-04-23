import React, { useState } from "react";

const NumberInput = ({
  name,
  setValue,
}: {
  name: string;
  setValue(input: number): void;
}) => {
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
    <div>
      <label htmlFor="value">{name} </label>
      <input
        id="value"
        type="text"
        inputMode="decimal"
        onChange={parseNumber}
        className="nodrag"
        value={rawValue}
      />
    </div>
  );
};

export default NumberInput;
