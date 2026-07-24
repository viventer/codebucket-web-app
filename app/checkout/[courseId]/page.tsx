import { notFound, redirect } from "next/navigation";

import { getCourseDocument } from "@/actions/courses/read-courses";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getSessionUser } from "@/lib/auth/session";
import {
  getPriceIdForCourse,
  isPurchasableCourse,
} from "@/lib/paddle/config";

type CheckoutPageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({ params }: CheckoutPageProps) {
  const { courseId } = await params;
  const course = await getCourseDocument(courseId);

  return {
    title: course
      ? `Zakup: ${course.title} – CodeBucket`
      : "Zakup kursu – CodeBucket",
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { courseId } = await params;
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    const search = new URLSearchParams({
      next: `/checkout/${courseId}`,
      reason: "purchase",
    });
    redirect(`/signup?${search.toString()}`);
  }

  if (!isPurchasableCourse(courseId)) {
    notFound();
  }

  const course = await getCourseDocument(courseId);
  if (!course || course.price.isFree) {
    notFound();
  }

  const priceId = getPriceIdForCourse(courseId);
  if (!priceId) {
    notFound();
  }

  return (
    <CheckoutClient
      courseId={courseId}
      priceId={priceId}
      userId={sessionUser.uid}
      email={sessionUser.email}
    />
  );
}
