import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { NavButton } from "./NavButton";
import { PlaceholderButton } from "./PlaceholderButton";

type ProjectActionsProps = {
  nextHref: string | null;
  hasMaterials: boolean;
};

export function ProjectActions({ nextHref, hasMaterials }: ProjectActionsProps) {
  return (
    <>
      {hasMaterials && <DownloadMaterialsButton />}
      <PlaceholderButton variant="ghost">Wskazówka</PlaceholderButton>
      <PlaceholderButton variant="ghost">Rozwiązanie</PlaceholderButton>
      <NavButton href={nextHref}>Zrobione</NavButton>
    </>
  );
}
