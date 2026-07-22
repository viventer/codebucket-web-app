import { MainContainer } from "@/components/MainContainer";
import { Skeleton } from "@/components/ui/skeleton";

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 shrink-0 rounded-md" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-5 w-24" />
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <MainContainer>
      <section className="flex min-h-[60dvh] max-h-[80dvh] flex-col items-center gap-9 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex w-full flex-col gap-3 shrink-0 lg:max-w-xl">
          <Skeleton className="h-10 w-full sm:h-12 lg:h-14" />
          <Skeleton className="h-10 w-4/5 sm:h-12 lg:h-14" />
          <Skeleton className="mt-2 h-4 w-full sm:h-5" />
          <Skeleton className="h-4 w-3/4 sm:h-5" />
          <Skeleton className="mt-4 h-12 w-full max-w-sm rounded-md" />
        </div>
        <Skeleton className="aspect-square w-full max-w-sm shrink-0 rounded-xl xl:max-w-md" />
      </section>

      <section className="flex flex-col items-center justify-center gap-8">
        <div className="flex w-full max-w-180 flex-col items-center gap-2">
          <Skeleton className="h-8 w-72 sm:h-9" />
          <Skeleton className="h-4 w-full max-w-md sm:h-5" />
        </div>
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="w-full max-w-3xl rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="mb-3 h-6 w-56" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-2/3" />
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-56 sm:h-9" />
          <Skeleton className="h-4 w-72 sm:h-5" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </section>
    </MainContainer>
  );
}
