import {
  CourseSectionsAccordion,
  type CourseSectionsAccordionSection,
} from "@/components/course/CourseSectionsAccordion";
import { SectionHeading } from "@/components/SectionHeading";
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
      <SectionHeading>
        <SectionHeading.Title>Program kursu</SectionHeading.Title>
        {note ? (
          <SectionHeading.Description className="mx-auto mb-4 max-w-xl">
            {note}
          </SectionHeading.Description>
        ) : null}
      </SectionHeading>
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
