"use client";

import { CourseLandingHeroStatusHeader } from "@/components/course/landing/CourseLandingHeroStatusHeader";
import { useCourseLandingUserState } from "@/components/course/landing/CourseLandingUserStateProvider";
import { PresaleGuaranteeInfo } from "@/components/course/landing/PresaleGuaranteeInfo";
import { Skeleton } from "@/components/ui/skeleton";

type AvailableCourseStatusProps = {
  isFree: boolean;
  isPresale: boolean;
  currentPrice?: number;
  regularPrice?: number;
  refundDays?: number;
};

export function AvailableCourseStatus({
  isFree,
  isPresale,
  currentPrice,
  regularPrice,
  refundDays,
}: AvailableCourseStatusProps) {
  const { loading, state } = useCourseLandingUserState();

  if (loading) {
    return (
      <section className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-0.5">
      <CourseLandingHeroStatusHeader
        state={state}
        isFree={isFree}
        isPresale={isPresale}
        currentPrice={currentPrice}
        standardPrice={regularPrice}
      />

      {state.status === "none" && isPresale ? (
        <PresaleGuaranteeInfo
          refundDays={refundDays ?? 0}
          className="w-full mt-4"
        />
      ) : null}
    </section>
  );
}
