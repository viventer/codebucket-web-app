const GUEST_PROGRESS_KEY = "cb_guest_progress";

export type GuestCourseEntry = {
  elementsCompleted: string[];
  /** Unix ms when the guest explicitly started the course (landing CTA). */
  startedAt?: number;
};

type GuestProgressStore = Record<string, GuestCourseEntry>;

function readStore(): GuestProgressStore {
  try {
    const raw = localStorage.getItem(GUEST_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GuestProgressStore;
  } catch {
    return {};
  }
}

function writeStore(store: GuestProgressStore): void {
  try {
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable (e.g. private browsing with storage blocked)
  }
}

function getOrCreateEntry(
  store: GuestProgressStore,
  courseId: string,
): GuestCourseEntry {
  return store[courseId] ?? { elementsCompleted: [] };
}

export function readGuestProgress(courseId: string): string[] {
  return readStore()[courseId]?.elementsCompleted ?? [];
}

/** Records that the guest started a free course (mirrors startCourse unlock for authed users). */
export function writeGuestCourseStarted(courseId: string): void {
  const store = readStore();
  const entry = getOrCreateEntry(store, courseId);
  if (entry.startedAt === undefined) {
    entry.startedAt = Date.now();
    store[courseId] = entry;
    writeStore(store);
  }
}

export function writeGuestElementCompleted(
  courseId: string,
  elementId: string,
): void {
  const store = readStore();
  const entry = getOrCreateEntry(store, courseId);
  if (!entry.elementsCompleted.includes(elementId)) {
    entry.elementsCompleted = [...entry.elementsCompleted, elementId];
    store[courseId] = entry;
    writeStore(store);
  }
}

export function readAllGuestProgress(): GuestProgressStore {
  return readStore();
}

export function getGuestCurrentCourseId(): string | null {
  const store = readStore();
  let currentCourseId: string | null = null;
  let latestStartedAt = 0;

  for (const [courseId, entry] of Object.entries(store)) {
    if (entry.startedAt !== undefined && entry.startedAt > latestStartedAt) {
      latestStartedAt = entry.startedAt;
      currentCourseId = courseId;
    }
  }

  return currentCourseId;
}

export function clearGuestProgress(): void {
  try {
    localStorage.removeItem(GUEST_PROGRESS_KEY);
  } catch {
    // ignore
  }
}

/** Returns true when the user has no active auth session (no cb_auth cookie). */
export function isGuestUser(): boolean {
  if (typeof document === "undefined") return true;
  return !document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("cb_auth="));
}

/** Derives completed section IDs from a set of completed element IDs. Mirrors server-side logic. */
export function computeSectionsCompleted(
  sections: { id: string; elementIds: string[] }[],
  completedIds: Set<string>,
): string[] {
  return sections
    .filter(
      (s) =>
        s.elementIds.length > 0 &&
        s.elementIds.every((id) => completedIds.has(id)),
    )
    .map((s) => s.id);
}
