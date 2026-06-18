import Link from "next/link";
import {
  CodeIcon,
  FileVideoIcon,
  FolderGitIcon,
  ListChecksIcon,
  MonitorPlayIcon,
  MousePointerClickIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

import type { CourseElement } from "@/schemas/courseSchema";
import { Button } from "@/components/ui/button";

type ElementActionBarProps = {
  type: CourseElement["type"];
  title: string;
  prevHref: string | null;
  nextHref: string | null;
  hasMaterials: boolean;
};

const TYPE_ICONS: Record<CourseElement["type"], LucideIcon> = {
  video: FileVideoIcon,
  codeExercise: CodeIcon,
  interactiveExercise: MousePointerClickIcon,
  interactiveDemo: MonitorPlayIcon,
  quiz: ListChecksIcon,
  guidedProject: FolderGitIcon,
  individualProject: UserIcon,
};

function NavButton({
  href,
  children,
  variant = "default",
}: {
  href: string | null;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
}) {
  if (href) {
    return (
      <Button variant={variant} asChild>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} disabled>
      {children}
    </Button>
  );
}

function PlaceholderButton({
  children,
  variant = "outline",
}: {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
}) {
  return (
    <Button variant={variant} disabled>
      {children}
    </Button>
  );
}

function BackNextActions({
  prevHref,
  nextHref,
}: {
  prevHref: string | null;
  nextHref: string | null;
}) {
  return (
    <>
      {prevHref && (
        <Button variant="ghost" asChild>
          <Link href={prevHref}>Cofnij</Link>
        </Button>
      )}
      <NavButton href={nextHref}>Przejdź dalej</NavButton>
    </>
  );
}

function ExerciseActions({ nextHref }: { nextHref: string | null }) {
  return (
    <>
      <PlaceholderButton variant="ghost">Wskazówka</PlaceholderButton>
      <PlaceholderButton variant="ghost">Rozwiązanie</PlaceholderButton>
      <PlaceholderButton variant="ghost">Reset</PlaceholderButton>
      <NavButton href={nextHref}>Zrobione</NavButton>
    </>
  );
}

function DownloadMaterialsButton() {
  return (
    <PlaceholderButton variant="ghost">Pobierz materiały</PlaceholderButton>
  );
}

function ProjectActions({
  nextHref,
  hasMaterials,
}: {
  nextHref: string | null;
  hasMaterials: boolean;
}) {
  return (
    <>
      {hasMaterials && <DownloadMaterialsButton />}
      <PlaceholderButton variant="ghost">Wskazówka</PlaceholderButton>
      <PlaceholderButton variant="ghost">Rozwiązanie</PlaceholderButton>
      <NavButton href={nextHref}>Zrobione</NavButton>
    </>
  );
}

function renderActions(
  type: CourseElement["type"],
  prevHref: string | null,
  nextHref: string | null,
  hasMaterials: boolean,
) {
  switch (type) {
    case "video":
    case "interactiveDemo":
      return <BackNextActions prevHref={prevHref} nextHref={nextHref} />;
    case "guidedProject":
      return (
        <>
          <BackNextActions prevHref={prevHref} nextHref={nextHref} />
          {hasMaterials && <DownloadMaterialsButton />}
        </>
      );
    case "individualProject":
      return (
        <ProjectActions nextHref={nextHref} hasMaterials={hasMaterials} />
      );
    case "codeExercise":
    case "interactiveExercise":
      return <ExerciseActions nextHref={nextHref} />;
    case "quiz":
      return (
        <PlaceholderButton variant="ghost">Następne pytanie</PlaceholderButton>
      );
  }
}

export function ElementActionBar({
  type,
  title,
  prevHref,
  nextHref,
  hasMaterials,
}: ElementActionBarProps) {
  const Icon = TYPE_ICONS[type];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4">
      <div className="mx-auto flex w-[95vw] max-w-[1280px] items-center justify-between gap-4 rounded-xl border bg-background/70 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="size-5 shrink-0 text-primary" />
          <p className="truncate text-sm font-medium text-foreground">
            {title}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {renderActions(type, prevHref, nextHref, hasMaterials)}
        </div>
      </div>
    </nav>
  );
}
