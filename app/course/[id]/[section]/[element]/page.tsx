import { notFound } from "next/navigation";

import { getCourseById } from "@/lib/courses";
import { CodeExerciseElement } from "@/components/course/elements/CodeExerciseElement";
import { GuidedProjectElement } from "@/components/course/elements/GuidedProjectElement";
import { IndividualProjectElement } from "@/components/course/elements/IndividualProjectElement";
import { InteractiveDemoElement } from "@/components/course/elements/InteractiveDemoElement";
import { InteractiveExerciseElement } from "@/components/course/elements/InteractiveExerciseElement";
import { VideoElement } from "@/components/course/elements/VideoElement";

type CourseElementPageProps = {
  params: Promise<{ id: string; section: string; element: string }>;
};

export default async function CourseElementPage({
  params,
}: CourseElementPageProps) {
  const { id, section: sectionId, element: elementId } = await params;

  const course = await getCourseById(id);
  if (!course) notFound();

  const section = course.sections.find((s) => s.id === sectionId);
  if (!section) notFound();

  const element = section.elements.find((e) => e.id === elementId);
  if (!element) notFound();

  switch (element.type) {
    case "video":
      return <VideoElement content={element.content} />;
    case "codeExercise":
      return <CodeExerciseElement content={element.content} />;
    case "interactiveExercise":
      return <InteractiveExerciseElement content={element.content} />;
    case "interactiveDemo":
      return <InteractiveDemoElement content={element.content} />;
    case "guidedProject":
      return <GuidedProjectElement content={element.content} />;
    case "individualProject":
      return <IndividualProjectElement content={element.content} />;
  }
}
