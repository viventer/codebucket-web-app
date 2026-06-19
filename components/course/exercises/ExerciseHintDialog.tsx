"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ExerciseHintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hints: string[];
};

export function ExerciseHintDialog({
  open,
  onOpenChange,
  hints,
}: ExerciseHintDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wskazówki</DialogTitle>
        </DialogHeader>
        <ul className="flex list-disc flex-col gap-2 list-inside">
          {hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
