import { notFound } from "next/navigation";

import {
  getCourseDocument,
  getCourseElement,
} from "@/actions/courses/read-courses";
import { toCourseElement } from "@/actions/courses/helpers";
import {
  resolveInteractiveExerciseAssets,
  resolveLocalCodeExerciseAssets,
} from "@/actions/storage/resolve-element-assets";
import { LocalCodeExerciseElement } from "@/components/course/elements/LocalCodeExerciseElement";
import { PlatformCodeExerciseElement } from "@/components/course/elements/PlatformCodeExerciseElement";
import { CheatsheetElement } from "@/components/course/elements/CheatsheetElement";
import { CourseEndingElement } from "@/components/course/elements/CourseEndingElement";
import { CustomExerciseElement } from "@/components/course/elements/CustomExerciseElement";
import { GuidedProjectElement } from "@/components/course/elements/GuidedProjectElement";
import { IndividualProjectElement } from "@/components/course/elements/IndividualProjectElement";
import { InteractiveDemoElement } from "@/components/course/elements/InteractiveDemoElement";
import { InteractiveExerciseElement } from "@/components/course/elements/InteractiveExerciseElement";
import { VideoElement } from "@/components/course/elements/VideoElement";
import { buildAvailableCoursesDisplay } from "@/lib/course/available-courses";
import type { CourseDocument } from "@/schemas/courseSchema";

type CourseElementPageProps = {
  params: Promise<{ id: string; section: string; element: string }>;
};

export default async function CourseElementPage({
  params,
}: CourseElementPageProps) {
  const { id, section: sectionId, element: elementId } = await params;

  const elementDocument = await getCourseElement(id, sectionId, elementId);
  if (!elementDocument) notFound();

  const element = toCourseElement(elementDocument);

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
    case "courseEnding": {
      const courseDocs = (
        await Promise.all(
          element.content.nextSteps.recommendedCourseIds.map((courseId) =>
            getCourseDocument(courseId),
          ),
        )
      ).filter((doc): doc is CourseDocument => doc !== null);

      return (
        <CourseEndingElement
          content={element.content}
          recommendedCourses={buildAvailableCoursesDisplay(courseDocs)}
        />
      );
    }
  }
}
