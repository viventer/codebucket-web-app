import { CheckIcon, EyeIcon, LightbulbIcon } from "lucide-react";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { NavButton } from "./NavButton";
import { PlaceholderButton } from "./PlaceholderButton";

type ProjectActionsProps = {
  nextHref: string | null;
  isNextSectionChange: boolean;
  hasMaterials: boolean;
};

export function ProjectActions({
  nextHref,
  isNextSectionChange,
  hasMaterials,
}: ProjectActionsProps) {
  return (
    <>
      {hasMaterials && <DownloadMaterialsButton />}
      <PlaceholderButton variant="ghost">
        <ActionBarButtonLabel label="Wskazówka" icon={LightbulbIcon} />
      </PlaceholderButton>
      <PlaceholderButton variant="ghost">
        <ActionBarButtonLabel label="Rozwiązanie" icon={EyeIcon} />
      </PlaceholderButton>
      <NavButton href={nextHref} crossesSection={isNextSectionChange}>
        <ActionBarButtonLabel label="Zrobione" icon={CheckIcon} />
      </NavButton>
    </>
  );
}
