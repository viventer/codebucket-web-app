import { Skeleton } from "@/components/ui/skeleton";

/** Light-card skeleton bars — Paddle checkout is always forced to light theme. */
const bar = "bg-black/10";

export function CheckoutPaddleSkeleton() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-4 flex flex-col gap-5 sm:inset-6"
    >
      {/* Payment method tabs */}
      <div className="flex flex-col gap-2">
        <Skeleton className={`h-3 w-28 ${bar}`} />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className={`h-11 rounded-lg ${bar}`} />
          <Skeleton className={`h-11 rounded-lg ${bar}`} />
          <Skeleton className={`h-11 rounded-lg ${bar}`} />
        </div>
      </div>

      {/* Email */}
      <div>
        <Skeleton className={`mb-1.5 h-3 w-24 ${bar}`} />
        <Skeleton className={`h-10 w-full rounded-lg ${bar}`} />
      </div>

      {/* Country */}
      <div>
        <Skeleton className={`mb-1.5 h-3 w-16 ${bar}`} />
        <Skeleton className={`h-10 w-full rounded-lg ${bar}`} />
      </div>

      {/* Cardholder name */}
      <div>
        <Skeleton className={`mb-1.5 h-3 w-40 ${bar}`} />
        <Skeleton className={`h-10 w-full rounded-lg ${bar}`} />
      </div>

      {/* Card number */}
      <div>
        <Skeleton className={`mb-1.5 h-3 w-28 ${bar}`} />
        <Skeleton className={`h-10 w-full rounded-lg ${bar}`} />
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Skeleton className={`mb-1.5 h-3 w-24 ${bar}`} />
          <Skeleton className={`h-10 w-full rounded-lg ${bar}`} />
        </div>
        <div>
          <Skeleton className={`mb-1.5 h-3 w-12 ${bar}`} />
          <Skeleton className={`h-10 w-full rounded-lg ${bar}`} />
        </div>
      </div>

      {/* Optional links: coupon / tax ID */}
      <div className="flex flex-col gap-2">
        <Skeleton className={`h-3.5 w-28 ${bar}`} />
        <Skeleton className={`h-3.5 w-24 ${bar}`} />
      </div>

      {/* Pay CTA */}
      <Skeleton className={`mt-1 h-12 w-full rounded-lg ${bar}`} />

      {/* Paddle merchant-of-record footer */}
      <div className="mt-auto flex flex-col items-center gap-1.5 pt-2">
        <Skeleton className={`h-3 w-3/4 max-w-xs ${bar}`} />
        <Skeleton className={`h-3 w-1/2 max-w-48 ${bar}`} />
      </div>
    </div>
  );
}
