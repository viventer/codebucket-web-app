import { migrateGuestProgress } from "@/actions/user/progress";
import {
  clearGuestProgress,
  getGuestCurrentCourseId,
  readAllGuestProgress,
} from "@/lib/course/guest-progress";

/** Merges all guest localStorage state into Firestore after login/signup. */
export async function migrateAllGuestProgressFromStorage(): Promise<void> {
  const store = readAllGuestProgress();
  const currentCourseId = getGuestCurrentCourseId();

  const migrations = Object.entries(store).map(([courseId, entry]) => {
    const started = entry.startedAt !== undefined;
    const hasProgress = entry.elementsCompleted.length > 0;

    if (!started && !hasProgress) {
      return Promise.resolve();
    }

    return migrateGuestProgress({
      courseId,
      elementsCompleted: entry.elementsCompleted,
      started,
      setAsCurrentCourse: courseId === currentCourseId,
    });
  });

  await Promise.all(migrations);
  clearGuestProgress();
}
