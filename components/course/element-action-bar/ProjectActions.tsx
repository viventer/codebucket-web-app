import { CheckIcon, EyeIcon, LightbulbIcon } from "lucide-react";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
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
      <PlaceholderButton variant="ghost">
        <ActionBarButtonLabel label="Wskazówka" icon={LightbulbIcon} />
      </PlaceholderButton>
      <PlaceholderButton variant="ghost">
        <ActionBarButtonLabel label="Rozwiązanie" icon={EyeIcon} />
      </PlaceholderButton>
      <NavButton href={nextHref}>
        <ActionBarButtonLabel label="Zrobione" icon={CheckIcon} />
      </NavButton>
    </>
  );
}
