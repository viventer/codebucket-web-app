import { cn } from "@/lib/utils";

type TimelineAxisProps = {
  className?: string;
};

export function TimelineDotAxis({ className }: TimelineAxisProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div
        className="absolute top-1.5 -right-2 -left-2 h-0.5 bg-border"
        aria-hidden
      />
      <span className="relative z-10 size-3 rounded-full bg-foreground" />
    </div>
  );
}

export function TimelineArrowAxis({ className }: TimelineAxisProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div
        className="absolute top-1.5 right-3 left-0 h-0 border-t-2 border-dashed border-foreground/60"
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute top-0 right-0 size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-foreground"
      />
      <span className="size-3 shrink-0" aria-hidden />
    </div>
  );
}
