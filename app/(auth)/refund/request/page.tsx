import Link from "next/link";
import { redirect } from "next/navigation";

import { RefundCourseCard } from "@/components/refund/RefundCourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";
import { getPurchasedCoursesForRefund } from "@/lib/refund/get-refundable-courses";

export const metadata = {
  title: "Wniosek o zwrot – CodeBucket",
};

export default async function RefundRequestPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    const search = new URLSearchParams({
      next: "/refund/request",
      reason: "refund",
    });
    redirect(`/login?${search.toString()}`);
  }

  const courses = await getPurchasedCoursesForRefund(sessionUser.uid);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Wniosek o zwrot
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nie masz żadnych zakupionych kursów.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {courses.map((course) => (
                <RefundCourseCard key={course.courseId} course={course} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Link
        href="/"
        className="mt-4 block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Wróć na stronę główną
      </Link>
    </>
  );
}
