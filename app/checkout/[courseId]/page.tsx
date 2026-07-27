import { notFound, redirect } from "next/navigation";

import { getCourseDocument } from "@/actions/courses/read-courses";
import { CheckoutInlineFrame } from "@/components/checkout/CheckoutInlineFrame";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/auth/session";
import { buildPresaleInfo, getCourseImageUrl } from "@/lib/course/landing-data";
import { getPriceIdForCourse, isPurchasableCourse } from "@/lib/paddle/config";

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

  const userDoc = await adminDB.collection("users").doc(sessionUser.uid).get();
  const unlockedCourses: string[] = userDoc.data()?.unlockedCourses ?? [];
  if (unlockedCourses.includes(courseId)) {
    redirect(`/course/${courseId}`);
  }

  const isPresale = course.isPresale ?? Boolean(course.presale);
  const presale = buildPresaleInfo(course.presale);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-12">
      <CheckoutOrderSummary
        courseId={courseId}
        title={course.title}
        description={course.description}
        imageUrl={getCourseImageUrl(courseId, course.image)}
        currentPrice={course.price.currentPrice}
        standardPrice={course.price.standardPrice}
        presale={presale}
        isPresale={isPresale}
      />
      <div className="lg:sticky lg:top-8 lg:self-start">
        <CheckoutInlineFrame
          courseId={courseId}
          priceId={priceId}
          userId={sessionUser.uid}
          email={sessionUser.email}
        />
      </div>
    </div>
  );
}
