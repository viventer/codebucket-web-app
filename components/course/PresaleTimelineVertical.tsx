import { Icon } from "@/components/ui/icon";
import type { PresaleTimelineStep } from "@/lib/course/presale-timeline";
import { cn } from "@/lib/utils";

type PresaleTimelineVerticalProps = {
  steps: PresaleTimelineStep[];
  className?: string;
};

export function PresaleTimelineVertical({
  steps,
  className,
}: PresaleTimelineVerticalProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.title}
            className="grid grid-cols-[auto_1.25rem_1fr] gap-x-3"
          >
            <div className="flex min-w-16 items-start justify-end pt-0.5">
              {step.dateLabel ? (
                <span className="text-right text-xs leading-none text-muted-foreground">
                  {step.dateLabel}
                </span>
              ) : null}
            </div>

            <div className="relative flex flex-col items-center self-stretch">
              {index < 2 ? (
                <span
                  className={cn(
                    "relative z-10 mt-0.5 size-3 shrink-0 rounded-full",
                    step.highlighted ? "bg-accent" : "bg-foreground",
                  )}
                />
              ) : null}

              {!isLast ? (
                <span
                  className="absolute top-3 bottom-0 w-px bg-border"
                  aria-hidden
                />
              ) : (
                <div
                  className="flex h-full min-h-16 w-full flex-col items-center"
                  aria-hidden
                >
                  <span className="w-0 flex-1 border-l border-dashed border-foreground/55" />
                  <span className="size-0 shrink-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-foreground" />
                </div>
              )}
            </div>

            <div
              className={cn("flex flex-col gap-1", isLast ? "pb-1" : "pb-6")}
            >
              <div className="flex items-center gap-2">
                <Icon
                  src={step.icon}
                  size={22}
                  className={
                    step.highlighted ? "text-accent" : "text-foreground"
                  }
                />
                <p className="font-medium leading-none">{step.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
