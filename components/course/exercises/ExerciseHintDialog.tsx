"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponsiveDialogContent } from "@/components/ui/ResponsiveDialogContent";

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
      <ResponsiveDialogContent>
        <DialogHeader>
          <DialogTitle>Ściąga</DialogTitle>
        </DialogHeader>
        <ul className="flex list-disc flex-col gap-2 list-inside">
          {hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </ResponsiveDialogContent>
    </Dialog>
  );
}
