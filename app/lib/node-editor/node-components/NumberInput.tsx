import React, { useState } from "react";

const NumberInput = ({
  setValue,
  defaultValue,
  disabled = false,
  ...props
}: {
  setValue(input: number): void;
  defaultValue: number;
  disabled?: boolean;
}) => {
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
      className="nodrag ml-3 w-8 rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
      value={rawValue}
      disabled={disabled}
      {...props}
    />
  );
};

export default NumberInput;
