import { Skeleton } from "@/components/ui/skeleton";

export function CourseElementSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="gap-3 border-b bg-background px-3">
        <div className="mx-auto flex h-14 w-[90vw] max-w-7xl items-center">
          <div className="flex min-w-0 items-center gap-8">
            <Skeleton className="hidden size-7 shrink-0 rounded-md sm:block" />
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="size-8 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-28 sm:w-40" />
              <Skeleton className="h-2 w-20 rounded-full sm:w-28" />
            </div>
          </div>
          <Skeleton className="ml-auto h-8 w-20 rounded-md" />
        </div>
      </header>

      <main className="mx-auto mt-8 w-[90vw] max-w-[90vw] flex-1 pb-28 sm:mt-16 lg:max-w-7xl">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="mt-6 flex flex-col gap-3">
          <Skeleton className="h-6 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-5/6 max-w-xl" />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4">
        <div className="mx-auto flex w-[90vw] max-w-7xl items-center justify-between rounded-xl border bg-background/70 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </nav>
    </div>
  );
}
