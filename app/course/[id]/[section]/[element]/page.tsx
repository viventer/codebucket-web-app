import { notFound } from "next/navigation";

import { getCourseById } from "@/lib/courses";
import {
  resolveInteractiveExerciseAssets,
  resolveLocalCodeExerciseAssets,
} from "@/lib/course/resolve-element-assets";
import { LocalCodeExerciseElement } from "@/components/course/elements/LocalCodeExerciseElement";
import { PlatformCodeExerciseElement } from "@/components/course/elements/PlatformCodeExerciseElement";
import { CheatsheetElement } from "@/components/course/elements/CheatsheetElement";
import { CustomExerciseElement } from "@/components/course/elements/CustomExerciseElement";
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
    case "platformCodeExercise":
      return <PlatformCodeExerciseElement content={element.content} />;
    case "localCodeExercise": {
      const { content } = await resolveLocalCodeExerciseAssets(
        id,
        elementId,
        element.content,
      );
      return <LocalCodeExerciseElement content={content} />;
    }
    case "interactiveExercise": {
      const { assetUrls, content } = await resolveInteractiveExerciseAssets(
        id,
        elementId,
        element.content,
      );
      return (
        <InteractiveExerciseElement content={content} assetUrls={assetUrls} />
      );
    }
    case "customExercise":
      return <CustomExerciseElement content={element.content} />;
    case "interactiveDemo":
      return <InteractiveDemoElement content={element.content} />;
    case "guidedProject":
      return <GuidedProjectElement content={element.content} />;
    case "individualProject":
      return <IndividualProjectElement content={element.content} />;
    case "cheatsheet":
      return (
        <CheatsheetElement
          courseId={id}
          cheatsheetId={elementId}
          content={element.content}
        />
      );
  }
}
