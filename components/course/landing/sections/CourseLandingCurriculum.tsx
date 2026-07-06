import {
  CourseSectionsAccordion,
  type CourseSectionsAccordionSection,
} from "@/components/course/CourseSectionsAccordion";

type CourseLandingCurriculumProps = {
  sections: CourseSectionsAccordionSection[];
};

export function CourseLandingCurriculum({
  sections,
}: CourseLandingCurriculumProps) {
  return (
    <section>
      <h2 className="text-lg font-medium mb-2">Program kursu</h2>
      <CourseSectionsAccordion sections={sections} showDescription />
    </section>
  );
}
