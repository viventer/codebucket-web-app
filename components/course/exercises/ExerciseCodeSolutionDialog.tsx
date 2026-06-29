"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CodeSnippet } from "@/schemas/courseSchema";

type ExerciseCodeSolutionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solutionCode: CodeSnippet[];
};

export function ExerciseCodeSolutionDialog({
  open,
  onOpenChange,
  solutionCode,
}: ExerciseCodeSolutionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rozwiązanie</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {solutionCode.map((snippet) => (
            <div key={snippet.language} className="flex flex-col gap-2">
              <p className="text-sm font-medium uppercase text-muted-foreground">
                {snippet.language}
              </p>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
