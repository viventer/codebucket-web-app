import { Skeleton } from "@/components/ui/skeleton";

export function CourseLandingSkeleton() {
  return (
    <main className="mx-auto flex w-[90vw] max-w-7xl flex-1 flex-col gap-24 pt-8 pb-24 sm:pb-32 sm:pt-16">
      <div className="flex gap-6">
        <section className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <section className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <Skeleton className="size-12 shrink-0 rounded-md sm:size-16" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-3/4 max-w-sm" />
              </div>
            </div>
            <Skeleton className="h-11 w-full max-w-md rounded-md" />
          </section>

          <div className="w-full rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:w-fit sm:min-w-64">
            <Skeleton className="mb-4 h-6 w-36" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="mb-4 h-6 w-44" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full max-w-xl" />
            ))}
          </div>
        </div>
      </div>

      <section>
        <Skeleton className="mx-auto mb-4 h-7 w-40" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
}
