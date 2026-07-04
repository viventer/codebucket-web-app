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
      <h2 className="mb-2 text-lg font-medium">Program kursu</h2>
      <CourseSectionsAccordion sections={sections} showDescription />
    </section>
  );
}
