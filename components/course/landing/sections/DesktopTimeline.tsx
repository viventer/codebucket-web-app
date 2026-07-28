export default function DesktopTimeline({
  startDate,
  releaseDate,
  refundPeriodLabel,
}: {
  startDate: string;
  releaseDate: string;
  refundPeriodLabel: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="relative flex flex-col items-center">
        <div
          className="absolute top-1.5 -right-3 left-0 h-0.5 bg-border"
          aria-hidden
        />
        <span className="relative z-10 size-3 rounded-full bg-foreground" />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {startDate}
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div
          className="absolute top-1.5 -right-3 -left-3 h-0.5 bg-border"
          aria-hidden
        />
        <span className="relative z-10 size-3 rounded-full bg-accent" />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {releaseDate}
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div
          className="absolute top-1.5 -left-3 right-3 h-0 border-t-2 border-dashed border-foreground/60"
          aria-hidden
        />
        <span
          aria-hidden
          className="absolute top-0 right-0 size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-foreground"
        />
        <span className="size-3 shrink-0" aria-hidden />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {refundPeriodLabel}
        </p>
      </div>
    </div>
  );
}
