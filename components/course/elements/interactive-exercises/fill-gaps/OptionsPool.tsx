"use client";

import { Button } from "@/components/ui/button";

type OptionsPoolProps = {
  options: string[];
  onSelect: (option: string) => void;
  disabled: boolean;
};

export function OptionsPool({ options, onSelect, disabled }: OptionsPoolProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant="outline"
          className="h-12 font-mono text-sm"
          onClick={() => onSelect(option)}
          disabled={disabled}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
