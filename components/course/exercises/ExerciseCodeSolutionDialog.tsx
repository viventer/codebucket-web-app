"use client";

import { StaticCodePanel } from "@/components/course/elements/interactive-exercises/gap-lines/StaticCodePanel";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResponsiveDialogContent } from "@/components/ui/ResponsiveDialogContent";
import type { CodeSnippet } from "@/schemas/exerciseSchema";

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
      <ResponsiveDialogContent className="sm:max-h-[85vh] sm:w-[90vw] sm:max-w-[calc(100%-2rem)] sm:overflow-hidden lg:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Rozwiązanie</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          {solutionCode.map((snippet) => (
            <div key={snippet.language} className="flex min-h-0 flex-col gap-2">
              <p className="text-sm font-medium uppercase text-muted-foreground">
                {snippet.language}
              </p>
              <StaticCodePanel
                code={snippet.code}
                language={snippet.language}
                className="max-w-none"
              />
            </div>
          ))}
        </div>
      </ResponsiveDialogContent>
    </Dialog>
  );
}
