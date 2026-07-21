import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { NavButton } from "./NavButton";
import { PlaceholderButton } from "./PlaceholderButton";

type ProjectActionsProps = {
  nextHref: string | null;
  hasMaterials: boolean;
};

export function ProjectActions({
  nextHref,
  hasMaterials,
}: ProjectActionsProps) {
  return (
    <>
      {hasMaterials && <DownloadMaterialsButton />}
      <PlaceholderButton variant="ghost">
        <ActionBarButtonLabel label="Ściąga" iconSrc="lightbulb.svg" />
      </PlaceholderButton>
      <PlaceholderButton variant="ghost">
        <ActionBarButtonLabel label="Rozwiązanie" iconSrc="eye.svg" />
      </PlaceholderButton>
      <NavButton href={nextHref}>
        <ActionBarButtonLabel label="Zrobione" iconSrc="checkCircle.svg" />
      </NavButton>
    </>
  );
}
