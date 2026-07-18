import { cn } from "@/lib/utils";

type FreeBadgeProps = {
  className?: string;
};

export function FreeBadge({ className }: FreeBadgeProps) {
  return (
    <div
      className={cn(
        "w-fit rounded-full  bg-secondary px-5 py-1 text-sm border border-feedback-success",
        className,
      )}
    >
      Cały kurs za darmo
    </div>
  );
}
