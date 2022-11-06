import React from "react";

export default function handleStringInput(
  setFunction: React.Dispatch<React.SetStateAction<string>>
) {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFunction(event.target.value);
}
