"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponsiveDialogContent } from "@/components/ui/ResponsiveDialogContent";

type ExerciseSolutionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ExerciseSolutionDialog({
  open,
  onOpenChange,
  onConfirm,
}: ExerciseSolutionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Czy na pewno chcesz poznać rozwiązanie?</DialogTitle>
          <DialogDescription>
            Więcej nauczysz się rozwiązując zadanie samodzielnie. Pamiętaj, że
            możesz skorzystać ze wskazówek.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button onClick={onConfirm}>Pokaż rozwiązanie</Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
        </div>
      </ResponsiveDialogContent>
    </Dialog>
  );
}
