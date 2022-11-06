import React from "react";

export default function handleNumberInput(
  setFunction: React.Dispatch<React.SetStateAction<number>>
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && isFinite(value)) {
      setFunction(value);
    }
  };
}
