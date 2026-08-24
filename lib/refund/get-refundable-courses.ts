import { firestoreTimestampToDate } from "@/actions/courses/timestamps";
import { getCourseDocument } from "@/actions/courses/read-courses";
import { adminDB } from "@/firebase/admin-init";
import { getRefundDeadline, isRefundEligible } from "@/lib/refund/eligibility";
import { buildPresaleInfo, getCourseImageUrl } from "@/lib/course/landing-data";

const purchaseDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatPurchaseDate(date: Date): string {
  return purchaseDateFormatter.format(date);
}

export type RefundableCourse = {
  courseId: string;
  title: string;
  imageUrl: string;
  purchaseDateLabel: string;
  isPresale: boolean;
  releaseDateLabel: string | null;
  paddleTransactionId: string;
  refundEligible: boolean;
  refundDeadlineLabel: string;
  alreadyRequested: boolean;
};

export async function getPurchasedCoursesForRefund(
  userId: string,
): Promise<RefundableCourse[]> {
  const [ordersSnapshot, requestsSnapshot] = await Promise.all([
    adminDB.collection("orders").where("userId", "==", userId).get(),
    adminDB.collection("refundRequests").where("userId", "==", userId).get(),
  ]);

  const pendingCourseIds = new Set(
    requestsSnapshot.docs
      .filter((doc) => doc.data().status === "pending")
      .map((doc) => String(doc.data().courseId ?? "")),
  );

  // `unlockedCourses` includes free courses, so refundable items come from paid
  // orders. Filter paymentStatus in memory to avoid a composite index.
  const paidOrders = ordersSnapshot.docs.filter(
    (doc) => doc.data().paymentStatus === "paid",
  );

  const earliestByCourse = new Map<
    string,
    { purchaseDate: Date; paddleTransactionId: string }
  >();

  for (const doc of paidOrders) {
    const data = doc.data();
    if (!data.createdAt) {
      continue;
    }
    const purchaseDate = firestoreTimestampToDate(data.createdAt);
    const paddleTransactionId: string = data.paddleTransactionId ?? doc.id;
    const courseIds: string[] = Array.isArray(data.courseIds)
      ? data.courseIds
      : [];

    for (const courseId of courseIds) {
      const existing = earliestByCourse.get(courseId);
      if (!existing || purchaseDate < existing.purchaseDate) {
        earliestByCourse.set(courseId, { purchaseDate, paddleTransactionId });
      }
    }
  }

  const courses = await Promise.all(
    [...earliestByCourse.entries()].map(async ([courseId, order]) => {
      const course = await getCourseDocument(courseId);
      const presale = course?.presale;
      const isPresale = course?.isPresale ?? Boolean(presale);
      const presaleInfo = buildPresaleInfo(presale);
      const deadline = getRefundDeadline(order.purchaseDate, presale);

      return {
        courseId,
        title: course?.title ?? courseId,
        imageUrl: course
          ? getCourseImageUrl(courseId, course.image)
          : "/logo.svg",
        purchaseDateLabel: formatPurchaseDate(order.purchaseDate),
        isPresale,
        releaseDateLabel: presaleInfo?.releaseDateLabel ?? null,
        paddleTransactionId: order.paddleTransactionId,
        refundEligible: isRefundEligible(order.purchaseDate, presale),
        refundDeadlineLabel: formatPurchaseDate(deadline),
        alreadyRequested: pendingCourseIds.has(courseId),
      } satisfies RefundableCourse;
    }),
  );

  return courses.sort((a, b) => a.title.localeCompare(b.title, "pl"));
}
