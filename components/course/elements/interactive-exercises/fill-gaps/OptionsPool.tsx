"use client";

import { Button } from "@/components/ui/button";

type OptionsPoolProps = {
  options: string[];
  onSelect: (option: string) => void;
  disabled: boolean;
};

export function OptionsPool({ options, onSelect, disabled }: OptionsPoolProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option, index) => (
        <Button
          key={`${option}-${index}`}
          type="button"
          variant="outline"
          className="h-8 font-mono text-[length:inherit]"
          onClick={() => onSelect(option)}
          disabled={disabled}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
