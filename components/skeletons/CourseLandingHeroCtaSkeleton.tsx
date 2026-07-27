import { Skeleton } from "@/components/ui/skeleton";

/**
 * Four-row skeleton matching the hero CTA layout
 * (status header title + subtitle + button + caption).
 * Used both for the route-level loading.tsx skeleton and while
 * CourseLandingHeroCta resolves client-side user state.
 */
export function CourseLandingHeroCtaSkeleton() {
  return (
    <div className="flex flex-col gap-6" data-course-landing-hero-cta>
      <div className="flex flex-col gap-0.5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-11 w-full max-w-md rounded-md" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
