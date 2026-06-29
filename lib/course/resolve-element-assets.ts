import { getPublicStorageUrls } from "@/firebase/storage";
import { getExerciseAssetStoragePath } from "@/lib/course-storage-paths";
import type {
  ExerciseStage,
  InteractiveExerciseContent,
  LocalCodeExerciseContent,
  SelectCorrectPrompt,
} from "@/schemas/courseSchema";

type AssetReference = {
  key: string;
  storagePath: string;
};

const previewHtmlImageSrcPattern =
  /\bsrc=(?:"([^"/][^"]*)"|'([^'/][^']*)')/g;

function collectExerciseAsset(
  courseId: string,
  elementId: string,
  filename: string,
  references: AssetReference[],
): void {
  const key = filename;
  if (references.some((reference) => reference.key === key)) {
    return;
  }

  references.push({
    key,
    storagePath: getExerciseAssetStoragePath(courseId, elementId, filename),
  });
}

function collectImageSrcFromPrompt(
  courseId: string,
  elementId: string,
  prompt: SelectCorrectPrompt | undefined,
  references: AssetReference[],
): void {
  if (prompt?.kind === "image") {
    collectExerciseAsset(courseId, elementId, prompt.imageSrc, references);
  }
}

function collectPreviewHtmlAssets(
  courseId: string,
  elementId: string,
  previewHtml: string,
  references: AssetReference[],
): void {
  for (const match of previewHtml.matchAll(previewHtmlImageSrcPattern)) {
    const filename = match[1] ?? match[2];
    if (!filename) continue;
    collectExerciseAsset(courseId, elementId, filename, references);
  }
}

function collectStageAssets(
  courseId: string,
  elementId: string,
  stage: ExerciseStage,
  references: AssetReference[],
): void {
  if (stage.type === "selectCorrect") {
    collectImageSrcFromPrompt(courseId, elementId, stage.prompt, references);
    return;
  }

  if (stage.type !== "fillGaps" && stage.type !== "fillCode") {
    return;
  }

  const presentation = stage.presentation;
  if (!presentation) return;

  if (presentation.kind === "image") {
    collectExerciseAsset(
      courseId,
      elementId,
      presentation.imageSrc,
      references,
    );
    return;
  }

  if (presentation.kind === "preview") {
    collectPreviewHtmlAssets(
      courseId,
      elementId,
      presentation.previewHtml,
      references,
    );
  }
}

function replacePreviewHtmlAssets(
  previewHtml: string,
  assetUrls: Record<string, string>,
): string {
  let resolved = previewHtml;

  for (const [filename, url] of Object.entries(assetUrls)) {
    resolved = resolved.replaceAll(`src="${filename}"`, `src="${url}"`);
    resolved = resolved.replaceAll(`src='${filename}'`, `src="${url}"`);
  }

  return resolved;
}

function resolveStageContent(
  assetUrls: Record<string, string>,
  stage: ExerciseStage,
): ExerciseStage {
  if (stage.type === "selectCorrect") {
    const prompt = stage.prompt;
    if (prompt?.kind !== "preview") {
      return stage;
    }

    return {
      ...stage,
      prompt: {
        ...prompt,
        previewHtml: replacePreviewHtmlAssets(prompt.previewHtml, assetUrls),
      },
    };
  }

  if (stage.type !== "fillGaps" && stage.type !== "fillCode") {
    return stage;
  }

  const presentation = stage.presentation;
  if (presentation?.kind !== "preview") {
    return stage;
  }

  return {
    ...stage,
    presentation: {
      ...presentation,
      previewHtml: replacePreviewHtmlAssets(
        presentation.previewHtml,
        assetUrls,
      ),
    },
  };
}

export async function resolveInteractiveExerciseAssets(
  courseId: string,
  elementId: string,
  content: InteractiveExerciseContent,
): Promise<{
  assetUrls: Record<string, string>;
  content: InteractiveExerciseContent;
}> {
  const references: AssetReference[] = [];

  for (const stage of content.stages) {
    collectStageAssets(courseId, elementId, stage, references);
  }

  if (references.length === 0) {
    return { assetUrls: {}, content };
  }

  const storagePaths = references.map((reference) => reference.storagePath);
  const urlsByStoragePath = await getPublicStorageUrls(storagePaths);

  const assetUrls = Object.fromEntries(
    references.map((reference) => [
      reference.key,
      urlsByStoragePath[reference.storagePath],
    ]),
  );

  const resolvedContent: InteractiveExerciseContent = {
    ...content,
    stages: content.stages.map((stage) =>
      resolveStageContent(assetUrls, stage),
    ),
  };

  return { assetUrls, content: resolvedContent };
}

function getHtmlFromSolutionCode(content: LocalCodeExerciseContent): string | null {
  return content.solutionCode.find((snippet) => snippet.language === "html")
    ?.code ?? null;
}

export async function resolveLocalCodeExerciseAssets(
  courseId: string,
  elementId: string,
  content: LocalCodeExerciseContent,
): Promise<{
  assetUrls: Record<string, string>;
  content: LocalCodeExerciseContent;
}> {
  const previewHtml = getHtmlFromSolutionCode(content);
  if (!previewHtml) {
    return { assetUrls: {}, content };
  }

  const references: AssetReference[] = [];
  collectPreviewHtmlAssets(courseId, elementId, previewHtml, references);

  if (references.length === 0) {
    return { assetUrls: {}, content };
  }

  const storagePaths = references.map((reference) => reference.storagePath);

  let urlsByStoragePath: Record<string, string>;
  try {
    urlsByStoragePath = await getPublicStorageUrls(storagePaths);
  } catch {
    return { assetUrls: {}, content };
  }

  const assetUrls = Object.fromEntries(
    references.map((reference) => [
      reference.key,
      urlsByStoragePath[reference.storagePath],
    ]),
  );

  const resolvedHtml = replacePreviewHtmlAssets(previewHtml, assetUrls);
  const resolvedContent: LocalCodeExerciseContent = {
    ...content,
    solutionCode: content.solutionCode.map((snippet) =>
      snippet.language === "html" ? { ...snippet, code: resolvedHtml } : snippet,
    ),
  };

  return { assetUrls, content: resolvedContent };
}
