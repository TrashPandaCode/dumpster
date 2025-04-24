import React, { useState } from "react";

const NumberInput = ({
  setValue,
  defaultValue,
}: {
  setValue(input: number): void;
  defaultValue: number;
}) => {
  // TODO: number input propably shouldn't have internal state (make it controlled)
  const [rawValue, setRawValue] = useState(String(defaultValue));

  const parseNumber = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const input = evt.target.value.replace(",", ".");
    
    if (/^\d*\.?\d*$/.test(input)) {
      setRawValue(input);
    }

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
