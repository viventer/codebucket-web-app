import {
  CourseSectionsAccordion,
  type CourseSectionsAccordionSection,
} from "@/components/course/CourseSectionsAccordion";

import { ExpandableElement } from "@/components/ui/ExpandableElement";

type CourseLandingCurriculumProps = {
  sections: CourseSectionsAccordionSection[];
  note?: string;
};

export function CourseLandingCurriculum({
  sections,
  note,
}: CourseLandingCurriculumProps) {
  return (
    <section>
      <h2 className="text-center text-xl font-medium mb-1">Program kursu</h2>
      {note ? (
        <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto mb-4">
          {note}
        </p>
      ) : null}
      <ExpandableElement
        collapsedHeight={210}
        expandText="Pokaż cały program"
        collapseText="Zwiń"
      >
        <CourseSectionsAccordion sections={sections} showDescription />
      </ExpandableElement>
    </section>
  );
}
