export type CourseLandingSectionInput = {
  id: string;
  title: string;
  elements: Array<{
    id: string;
    href: string;
  }>;
};

export type CourseLandingUserState =
  | { status: "none" }
  | {
      status: "owned-presale";
      label: string;
      subtitle: string;
      buttonLabel: string;
    }
  | {
      status: "in-progress";
      label: string;
      subtitle: string;
      buttonLabel: string;
      resumeHref: string;
    }
  | {
      status: "completed";
      label: string;
      subtitle: string;
      buttonLabel: string;
      resumeHref: string;
    };

type DeriveInput = {
  sections: CourseLandingSectionInput[];
  elementsCompleted: string[];
  unlocked: boolean;
  isPresale: boolean;
};

export function isOwnedLandingStatus(
  status: CourseLandingUserState["status"],
): boolean {
  return status !== "none";
}

export function deriveCourseLandingUserState({
  sections,
  elementsCompleted,
  unlocked,
  isPresale,
}: DeriveInput): CourseLandingUserState {
  if (!unlocked) {
    return { status: "none" };
  }

  if (isPresale) {
    return {
      status: "owned-presale",
      label: "Kurs należy do Ciebie",
      subtitle: "O premierze poinformujemy Cię e-mailem.",
      buttonLabel: "Rozpocznij",
    };
  }

  const allElements = sections.flatMap((section) => section.elements);
  const hasElements = allElements.length > 0;
  const completedSet = new Set(elementsCompleted);
  const isCompleted =
    hasElements && allElements.every((element) => completedSet.has(element.id));

  if (isCompleted) {
    const firstElement = allElements[0];
    if (!firstElement) {
      return { status: "none" };
    }

    return {
      status: "completed",
      label: "Kurs ukończony",
      subtitle: "Możesz wrócić do dowolnego tematu.",
      buttonLabel: "Wróć do kursu",
      resumeHref: firstElement.href,
    };
  }

  let activeSectionIndex = 0;
  let resumeHref = allElements[0]?.href;

  if (hasElements && elementsCompleted.length > 0) {
    outer: for (
      let sectionIndex = 0;
      sectionIndex < sections.length;
      sectionIndex++
    ) {
      const section = sections[sectionIndex];
      if (!section) continue;

      for (const element of section.elements) {
        if (!completedSet.has(element.id)) {
          activeSectionIndex = sectionIndex;
          resumeHref = element.href;
          break outer;
        }
      }
    }
  }

  const activeSection = sections[activeSectionIndex];
  if (!resumeHref || !activeSection) {
    return { status: "none" };
  }

  return {
    status: "in-progress",
    label: "Jesteś w trakcie",
    subtitle: `Aktywna sekcja: ${activeSectionIndex + 1}. ${activeSection.title}`,
    buttonLabel: "Kontynuuj naukę",
    resumeHref,
  };
}
