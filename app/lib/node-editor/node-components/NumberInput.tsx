/*
 * Authors: Jonathan Kron, Leo Kling
 *
 * Purpose:
 * This file offers a React component for a sanitazed number input. It is used in most nodes.
 */
import { useNodeConnections } from "@xyflow/react";
import React, { useState } from "react";

const NumberInput = ({
  value,
  setValue,
  defaultValue,
  handleId,
  type = "float",
  ...props
}: {
  value?: number | string;
  setValue(input: number): void;
  defaultValue: number;
  handleId?: string;
  type?: "float" | "int";
}) => {
  const disabled = !!useNodeConnections({
    handleId,
    handleType: "target",
  }).length;

  const [rawValue, setRawValue] = useState(String(defaultValue));

  const parseFloatNumber = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled && value) return;

    const input = evt.target.value.replace(",", ".");

    if (/^(-?)\d*\.?\d*$/.test(input)) {
      setRawValue(input);
    }

    const parsed = Number(input);
    if (!isNaN(parsed)) {
      setValue(parsed);
    }
  };

  const parseIntNumber = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled && value) return;

    const input = evt.target.value;

    if (/^(-?)\d*$/.test(input)) {
      setRawValue(input);
      setValue(Number(input));
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      onChange={(evt) => {
        switch (type) {
          case "float":
            parseFloatNumber(evt);
            break;
          case "int":
            parseIntNumber(evt);
            break;
        }
      }}
      className="nodrag ml-3 w-12 rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
      value={value && disabled ? value : rawValue}
      disabled={disabled}
      {...props}
    />
  );
};

export default NumberInput;
